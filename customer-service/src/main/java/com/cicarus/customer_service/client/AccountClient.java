package com.cicarus.customer_service.client;

import com.cicarus.customer_service.dto.AccountRequest;
import com.cicarus.customer_service.dto.AccountResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="account")
public interface AccountClient {
    @PostMapping("/account")
    AccountResponse createAccount(@RequestBody AccountRequest request);
}
