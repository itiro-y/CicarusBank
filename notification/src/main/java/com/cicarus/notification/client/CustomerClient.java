package com.cicarus.notification.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service", path = "/api/customers")
public interface CustomerClient {
    @GetMapping("/{id}")
    Object getCustomerById(@PathVariable("id") Long id);
}

