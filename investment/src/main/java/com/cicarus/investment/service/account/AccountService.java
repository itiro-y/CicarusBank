package com.cicarus.investment.service.account;

import com.cicarus.investment.clients.AccountClient;
import com.cicarus.investment.model.account.AccountDto;
import com.cicarus.investment.model.transaction.TransactionType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AccountService {
    private final AccountClient accountClient;

    public AccountService(AccountClient accountClient) {
        this.accountClient = accountClient;
    }

    public AccountDto withdrawUSD(Long accountId, BigDecimal amount) {
         return accountClient.withdrwaUSD(accountId, amount);
    }

    public AccountDto depositUSD(Long accountId, BigDecimal amount) {
        return accountClient.depositUSD(accountId, amount);
    }

    public AccountDto alterarSaldo(Long id, BigDecimal amount, TransactionType transactionType){
        return accountClient.alterarSaldo(id, amount, transactionType);
    }
}
