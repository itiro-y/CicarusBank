package com.sicarus.clients;

import com.sicarus.dto.AccountDTO;
import com.sicarus.dto.CustomerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customers")
public interface CustomerClient {

    @GetMapping("/customers/brief/{id}")
    CustomerDto getCustomerById(@PathVariable("id") Long id);
}
