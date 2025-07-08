package com.sicarus.controller;

import com.sicarus.clients.AccountClient;
import com.sicarus.dto.AccountDTO;
import com.sicarus.dto.TransactionRequestDTO;
import com.sicarus.model.Transaction;
import com.sicarus.model.TransactionStatus;
import com.sicarus.model.TransactionType;
import com.sicarus.repository.TransactionRepository;
import com.sicarus.service.TransactionService;
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

@RestController
@RequestMapping("transaction")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    private TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Get all transactions
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Get transaction by id
    @GetMapping("/{id}")
    public Optional<Transaction> getTransactionById(@PathVariable Long id){
        return transactionRepository.findById(id);
    }

    // Post new transaction passing a JSON request body
    @PostMapping
    public ResponseEntity<String> postTransaction(@RequestBody TransactionRequestDTO request){

        // Pega um AccountDTO por ID do micro Account
        AccountDTO account = transactionService.getAccount(request.getAccountId());



        if(request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0){
            return ResponseEntity.badRequest().body("Quantia recebida como parâmetro é zero/negativo/null");
        }

        // Verificar se a conta existe
        if(account == null) {
            return ResponseEntity.badRequest().body("Conta não existe");
        }

        // Verificar se a conta possui saldo
        if(transactionService.validaSaldo(request.getAccountId(), request.getAmount())){
            return ResponseEntity.badRequest().body("Conta não possui saldo suficiente");
        }

        if(request.getTransactionType().equals(TransactionType.DEPOSIT)){
            // Depositar no account e salvar no banco de account
        }

        if(request.getTransactionType().equals(TransactionType.WITHDRAWAL)){
            // Sacar de account e salvar novo saldo no banco de account
        }

        if(request.getTransactionType().equals(TransactionType.TRANSFER)){
            // Transferir dinheiro de account para accountTo e salvar ambos saldos

            AccountDTO accountTo = transactionService.getAccount(request.getAccountToId());

        }

        Transaction transaction = new Transaction();
        transaction.setAccountId(request.getAccountId());
        transaction.setTransactionType(request.getTransactionType());
        transaction.setAmount(request.getAmount());
        transaction.setTimestamp(new Date());
        transaction.setTransactionStatus(TransactionStatus.ACTIVE);

        transactionRepository.save(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body("Transação criada com sucesso!");
    }

    // Put that cancels a transaction based on a given id
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
    @GetMapping("/account/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable Long id){
        AccountDTO account = transactionService.getAccount(id);
        return ResponseEntity.ok(account);
    }

}
