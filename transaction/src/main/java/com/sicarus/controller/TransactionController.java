package com.sicarus.controller;

import com.sicarus.dto.TransactionRequestDTO;
import com.sicarus.model.Transaction;
import com.sicarus.model.TransactionStatus;
import com.sicarus.model.TransactionType;
import com.sicarus.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("transaction")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Transaction> getTransactionById(@PathVariable Long id){
        return transactionRepository.findById(id);
    }

    @PostMapping
    public ResponseEntity<String> postTransaction(@RequestBody TransactionRequestDTO request){
        if(request.getAmount() == null || request.getAmount() <= 0){
            return ResponseEntity.badRequest().body("Amount given as parameter is zero/negative/null.");
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

    // To-Do -> Cacelamento Logico

    // To-Do -> Estorno

}
