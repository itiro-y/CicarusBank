package com.sicarus.clients;

import com.sicarus.dto.AccountDTO;
import com.sicarus.model.TransactionType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.math.BigDecimal;

@FeignClient(name = "account")
public interface AccountClient {

    @GetMapping("/account/{id}")
    AccountDTO getAccountById(@PathVariable("id") Long id);

    @PutMapping("/account/{id}/{amount}/{flag}")
    AccountDTO updateAccount(@PathVariable("id") Long id,
                             @PathVariable("amount") BigDecimal amount,
                             @PathVariable("flag") TransactionType flag);
}
