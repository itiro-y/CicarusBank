package com.sicarus.clients;

import com.sicarus.dto.AccountDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "account")
public interface AccountClient {

    @GetMapping("/account/{id}")
    AccountDTO getAccountById(@PathVariable("id") Long id);
}
