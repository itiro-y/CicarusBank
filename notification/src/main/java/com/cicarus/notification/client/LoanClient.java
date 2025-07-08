package com.cicarus.notification.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "loan-service", path = "/api/loans")
public interface LoanClient {
    @GetMapping("/{id}/status")
    Object getLoanStatusById(@PathVariable("id") Long id);
}

