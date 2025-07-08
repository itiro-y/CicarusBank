package com.sicarus.service;

import com.sicarus.clients.AccountClient;
import com.sicarus.dto.AccountDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class TransactionService {
    private final AccountClient accountClient;

    public TransactionService(AccountClient accountClient) {
        this.accountClient = accountClient;
    }

    public AccountDTO validaSaldo(Long accountId, BigDecimal amount){
        AccountDTO account = accountClient.getAccountById(accountId);
        return account;
    }
}
