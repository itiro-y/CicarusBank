package com.sicarus.account.clients;

import com.sicarus.account.dto.CustomerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customers")
public interface LoanCustomer {

    @GetMapping("/customers/{id}")
    CustomerDto findById(@PathVariable("id") Long id);
}
