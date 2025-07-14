package com.sicarus.service;

import com.sicarus.clients.AccountClient;
import com.sicarus.dto.AccountDTO;
import com.sicarus.model.Transaction;
import com.sicarus.model.TransactionStatus;
import com.sicarus.model.TransactionType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;

@Service
public class TransactionService {
    private final AccountClient accountClient;

    public TransactionService(AccountClient accountClient) {
        this.accountClient = accountClient;
    }

    public Transaction createAndSetTransaction(Long accountId, BigDecimal amount, TransactionType transactionType, TransactionStatus transactionStatus) {
        Transaction transaction = new Transaction();
        transaction.setAccountId(accountId);
        transaction.setTransactionType(transactionType);
        transaction.setAmount(amount);
        transaction.setTimestamp(new Date());
        transaction.setTransactionStatus(transactionStatus);

        return transaction;
    }

    public AccountDTO getAccount(Long accountId) {
        AccountDTO account = accountClient.getAccountById(accountId);
        return account;
    }

    public boolean validateBalance(Long accountId, BigDecimal amount, TransactionType transactionType){
        AccountDTO account = accountClient.getAccountById(accountId);
        BigDecimal balance = account.getBalance();

        if(amount == null || amount.compareTo(BigDecimal.ZERO) <= 0){
            System.out.println("flag1");
            return true;
        }

        if((balance == null || balance.compareTo(BigDecimal.ZERO) <= 0) && !transactionType.equals(TransactionType.DEPOSIT)) {
            System.out.println("flag2");
            return true;
        }

        if (balance.subtract(amount).compareTo(BigDecimal.ZERO) < 0 && transactionType == TransactionType.WITHDRAWAL) {
            System.out.println("flag3");
            return true;
        }
        return false;
    }

    public void transferBalance(Long accountId, Long accountToId, BigDecimal amount){
        accountClient.updateAccount(accountId, amount, TransactionType.WITHDRAWAL);
        accountClient.updateAccount(accountToId, amount, TransactionType.DEPOSIT);
    }

    public void depositBalance(Long accountId, BigDecimal amount){
        accountClient.updateAccount(accountId, amount, TransactionType.DEPOSIT);
    }

    public void withdrawBalance(Long accountId, BigDecimal amount){
        accountClient.updateAccount(accountId, amount, TransactionType.WITHDRAWAL);
    }
}
