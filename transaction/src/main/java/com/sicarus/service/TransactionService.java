package com.sicarus.service;

import com.sicarus.clients.AccountClient;
import com.sicarus.dto.AccountDTO;
import com.sicarus.model.TransactionType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class TransactionService {
    private final AccountClient accountClient;

    public TransactionService(AccountClient accountClient) {
        this.accountClient = accountClient;
    }

    public AccountDTO getAccount(Long accountId) {
        AccountDTO account = accountClient.getAccountById(accountId);
        return account;
    }

    public boolean validaSaldo(Long accountId, BigDecimal amount){
        AccountDTO account = accountClient.getAccountById(accountId);
        BigDecimal balance = account.getBalance();

        if(amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
            return false;

        if(balance == null || balance.compareTo(BigDecimal.ZERO) <= 0)
            return false;

        if (balance.compareTo(amount) < 0)
            return false;

        return true;
    }

    public void transfereSaldo(Long accountId, Long accountToId, BigDecimal amount, TransactionType flag){
        AccountDTO accountFrom = accountClient.getAccountById(accountId);
        AccountDTO accountTo = accountClient.getAccountById(accountToId);

        accountClient.updateAccount(accountId, amount, flag);
    }
}
