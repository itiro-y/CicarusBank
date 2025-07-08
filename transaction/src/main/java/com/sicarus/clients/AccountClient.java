package com.sicarus.clients;

import com.sicarus.dto.AccountDTO;
import com.sicarus.model.TransactionType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.math.BigDecimal;

@FeignClient(name = "account")
public interface AccountClient {

    @GetMapping("/account/{id}")
    AccountDTO getAccountById(@PathVariable("id") Long id);

    @PutMapping("/account/{id}/{saldo}/{tipoTransacao}")
    AccountDTO updateAccount(@PathVariable("id") Long id,
                             @PathVariable("saldo") BigDecimal amount,
                             @PathVariable("tipoTransacao") TransactionType transactionType);
}
