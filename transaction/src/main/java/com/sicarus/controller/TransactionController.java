package com.sicarus.controller;

import com.sicarus.clients.AccountClient;
import com.sicarus.dto.*;
import com.sicarus.model.Transaction;
import com.sicarus.model.TransactionStatus;
import com.sicarus.model.TransactionType;
import com.sicarus.repository.TransactionRepository;
import com.sicarus.service.NotificationProducer;
import com.sicarus.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.Path;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@Tag(name = "Transaction Endpoint")
@RestController
@RequestMapping("transaction")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;
    private TransactionService transactionService;
    private NotificationProducer notificationProducer;

    public TransactionController(TransactionService transactionService, NotificationProducer notificationProducer) {
        this.transactionService = transactionService;
        this.notificationProducer = notificationProducer;
    }

    // Get all transactions
    @Operation(summary = "Get all transactions")
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Get transaction by id
    @Operation(summary = "Get a transaction by id")
    @GetMapping("/{id}")
    public Optional<Transaction> getTransactionById(@PathVariable Long id){
        return transactionRepository.findById(id);
    }

    // Get transaction by AccountID
    @Operation(summary = "Get a list of transactions by accountId")
    @GetMapping("/accounts/{accountId}")
    public List<Transaction> getTransactionByAccountId(@PathVariable Long accountId){
        List<Transaction> transactionList =  transactionRepository.findAll();
        List<Transaction> transactions = new ArrayList<>();
        for(Transaction t : transactionList){
            if(t.getAccountId().equals(accountId)){
                transactions.add(t);
            }
        }
        return transactions;
    }

    @Operation(summary = "Get a list of transaction by TransactionStatus")
    @GetMapping("/status/{transactionStatus}")
    public List<Transaction> getTransactionByStatus(@PathVariable TransactionStatus transactionStatus){
        List<Transaction> transactionList = new ArrayList<>();
        for(Transaction t : transactionRepository.findAll()){
            if(t.getTransactionStatus().equals(transactionStatus)){
                transactionList.add(t);
            }
        }
        return transactionList;
    }

    @Operation(summary = "Get a list of transaction by AccountId and TransactionStatus")
    @GetMapping("/accounts-status/{accountId}/{transactionStatus}")
    public List<Transaction> getTransactionByAccountIdAndStatus(@PathVariable Long accountId,
                                                                @PathVariable TransactionStatus transactionStatus){
        List<Transaction> transactionList = new ArrayList<>();
        for(Transaction t : transactionRepository.findAll()){
            if(t.getTransactionStatus().equals(transactionStatus) && t.getAccountId().equals(accountId)){
                transactionList.add(t);
            }
        }
        return transactionList;
    }

    // Post new transaction passing a JSON request body
    @Operation(summary = "Post a new transaction. It receives a JSON request body of type TransactionRequestDTO")
    @PostMapping
    public ResponseEntity<String> postTransaction(@RequestBody TransactionRequestDTO request){

        // Pega um AccountDTO por ID do micro Account
        AccountDTO account = transactionService.getAccount(request.getAccountId());

        if(request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0){
            Transaction transaction = transactionService.createAndSetTransaction(request.getAccountId(),
                                                                                 request.getAmount(),
                                                                                 request.getTransactionType(),
                                                                                 TransactionStatus.DECLINED);
            transactionRepository.save(transaction);
            return ResponseEntity.badRequest().body("Quantia recebida como parâmetro é zero/negativo/null");
        }

        // Verificar se a conta existe
        if(account == null) {
            Transaction transaction = transactionService.createAndSetTransaction(request.getAccountId(),
                                                                                 request.getAmount(),
                                                                                 request.getTransactionType(),
                                                                                 TransactionStatus.DECLINED);
            transactionRepository.save(transaction);
            return ResponseEntity.badRequest().body("Conta não existe");
        }

        // Verificar se a conta possui saldo
        if(transactionService.validateBalance(request.getAccountId(), request.getAmount(), request.getTransactionType())){
            Transaction transaction = transactionService.createAndSetTransaction(request.getAccountId(),
                                                                                 request.getAmount(),
                                                                                 request.getTransactionType(),
                                                                                 TransactionStatus.DECLINED);
            transactionRepository.save(transaction);
            return ResponseEntity.badRequest().body("Erro: Saldo insuficiente/nulo");
        }

        if(request.getTransactionType().equals(TransactionType.DEPOSIT)){

            // Depositar no account e salvar no banco de account
            transactionService.depositBalance(account.getId(), request.getAmount());

            //Implementar chamado ao metodo para geração e envio de e-mail de notificação deposito-----------------------------------------------------------
            DepositNotificationDto depositNotificationDto = new DepositNotificationDto();
            depositNotificationDto.setType("deposit");
            depositNotificationDto.setAmount(request.getAmount());
            depositNotificationDto.setCustomerId(account.getUserId());
            notificationProducer.sendNotification(depositNotificationDto);
        }

        if(request.getTransactionType().equals(TransactionType.WITHDRAWAL)){
            // Sacar de account e salvar novo saldo no banco de account
            transactionService.withdrawBalance(account.getId(), request.getAmount());

            //Implementar chamado ao metodo para geração e envio de e-mail de notificação saque-----------------------------------------------------------
            WithdrawalNotificationDto wnd = new WithdrawalNotificationDto();
            wnd.setType("withdrawal");
            wnd.setAmount(request.getAmount());
            wnd.setCustomerId(account.getUserId());
            notificationProducer.sendNotification(wnd);
        }

        if(request.getTransactionType().equals(TransactionType.TRANSFER)){
            // Transferir dinheiro de account para accountTo e salvar ambos saldos
            AccountDTO accountTo = transactionService.getAccount(request.getAccountToId());

            Long accountFromId = account.getId();
            Long accountToId = accountTo.getId();
            BigDecimal amount = request.getAmount();
            transactionService.transferBalance(accountFromId, accountToId, amount);

            //Implementar chamado ao metodo para geração e envio de e-mail de notificação transferência-----------------------------------------------------------
            TranferenceNotificationDto tranferenceNotificationDto = new TranferenceNotificationDto();
            tranferenceNotificationDto.setType("tranference");
            tranferenceNotificationDto.setAmount(request.getAmount());
            tranferenceNotificationDto.setCustomerId(account.getUserId());

            tranferenceNotificationDto.setAccountToId(accountTo.getId());
            tranferenceNotificationDto.setCustomerToId(accountTo.getUserId());


            notificationProducer.sendNotification(tranferenceNotificationDto);
        }

        Transaction transaction = transactionService.createAndSetTransaction(request.getAccountId(),
                                                                             request.getAmount(),
                                                                             request.getTransactionType(),
                                                                             TransactionStatus.COMPLETED);

        transactionRepository.save(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body("Transação criada com sucesso!");
    }

    // Put that cancels a transaction based on a given id
    @Operation(summary = "Put that cancels a transaction based on a given id")
    @PutMapping("/cancel/{id}")
    public ResponseEntity<String> cancelTransaction(@PathVariable Long id){
        if(transactionRepository.findById(id).isPresent()){
            Transaction transaction = transactionRepository.findById(id).get();
            transaction.setTransactionStatus(TransactionStatus.CANCELLED);
            transactionRepository.save(transaction);
            return ResponseEntity.ok().body("Transação cancelada com sucesso!");
        }else{
            return ResponseEntity.badRequest().body("Transação não encontrada.");
        }
    }

    // Put that reversals a transaction based on a given id
    @Operation(summary = "Put that reversals a transaction based on a given id")
    @PutMapping("/reversal/{id}")
    public ResponseEntity<String> reversalTransaction(@PathVariable Long id){

        if(transactionRepository.findById(id).isPresent()){
            Transaction transaction = transactionRepository.findById(id).get();
            AccountDTO account = transactionService.getAccount(transaction.getAccountId());

            if(transaction.getTransactionType().equals(TransactionType.DEPOSIT)){
                transactionService.withdrawBalance(account.getId(), transaction.getAmount());
            }

            if(transaction.getTransactionType().equals(TransactionType.WITHDRAWAL)){
                transactionService.depositBalance(account.getId(), transaction.getAmount());
            }

            if(transaction.getTransactionType().equals(TransactionType.TRANSFER)){
                System.out.println("Estorno da Transação será feita em alguns dias");
            }

            transaction.setTransactionStatus(TransactionStatus.REVERSED);
            transactionRepository.save(transaction);
            return ResponseEntity.ok().body("Transação estornada com sucesso!");

        }else{
            return ResponseEntity.badRequest().body("Transação não encontrada.");
        }
    }

    // Get account by Id
    @Operation(summary = "Get account from (account microservice) by Id")
    @GetMapping("/account/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable Long id){
        AccountDTO account = transactionService.getAccount(id);
        return ResponseEntity.ok(account);
    }

    //Metod for tests in Kafka
    @GetMapping("/kafkaTest")
    public ResponseEntity<NotificationDto> kafkaTest(){
        NotificationDto n = notificationProducer.getNotification();
        notificationProducer.send(n);
        return ResponseEntity.ok(n);
    }

    @GetMapping("/ping")
    public String ping(){
        return "pong";
    }
  
}
