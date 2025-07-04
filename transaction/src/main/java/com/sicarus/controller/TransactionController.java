package com.sicarus.controller;

import com.sicarus.model.Transaction;
import com.sicarus.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("transaction")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/")
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

}
