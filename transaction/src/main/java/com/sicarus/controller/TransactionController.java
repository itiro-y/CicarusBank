package com.sicarus.controller;

import com.sicarus.clients.AccountClient;
import com.sicarus.dto.AccountDTO;
import com.sicarus.dto.NotificationDto;
import com.sicarus.dto.TransactionRequestDTO;
import com.sicarus.model.Transaction;
import com.sicarus.model.TransactionStatus;
import com.sicarus.model.TransactionType;
import com.sicarus.repository.TransactionRepository;
import com.sicarus.service.NotificationProducer;
import com.sicarus.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
        }

        if(request.getTransactionType().equals(TransactionType.WITHDRAWAL)){
            // Sacar de account e salvar novo saldo no banco de account
            transactionService.withdrawBalance(account.getId(), request.getAmount());
        }

        if(request.getTransactionType().equals(TransactionType.TRANSFER)){
            // Transferir dinheiro de account para accountTo e salvar ambos saldos
            AccountDTO accountTo = transactionService.getAccount(request.getAccountToId());

            Long accountFromId = account.getId();
            Long accountToId = accountTo.getId();
            BigDecimal amount = request.getAmount();
            transactionService.transferBalance(accountFromId, accountToId, amount);
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

}
