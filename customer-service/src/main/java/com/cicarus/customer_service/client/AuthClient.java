package com.cicarus.customer_service.client;

import com.cicarus.customer_service.dto.AuthCreateRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "auth")
public interface AuthClient {

    @PostMapping("/auth/create")
    void createUser(@RequestBody AuthCreateRequest request);
}
