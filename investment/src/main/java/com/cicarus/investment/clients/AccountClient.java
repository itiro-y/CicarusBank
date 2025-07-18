package com.cicarus.investment.clients;

import com.cicarus.investment.model.account.AccountDto;
import com.cicarus.investment.model.transaction.TransactionType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.math.BigDecimal;

@FeignClient(name = "account")
public interface AccountClient {

    @PutMapping("/account/withdrwaUSD/{accountId}/{amount}")
    AccountDto withdrwaUSD(@PathVariable Long accountId, @PathVariable BigDecimal amount);

    @PutMapping("/account/{id}/{amount}/{transactionType}")
    AccountDto alterarSaldo(
            @PathVariable Long id,
            @PathVariable BigDecimal amount,
            @PathVariable TransactionType transactionType
    );
}
