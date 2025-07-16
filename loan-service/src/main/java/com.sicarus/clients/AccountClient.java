package com.sicarus.clients;

import com.sicarus.dto.CustomerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "account")
public interface AccountClient {

    @GetMapping("/account/customer/{id}")
    Long findById(@PathVariable("id") Long id);
}
