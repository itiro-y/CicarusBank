package com.sicarus.clients;

import com.sicarus.dto.TransactionRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "transaction")
public interface  TransactionClient {

    @PostMapping("/transaction")
    ResponseEntity<String> processPayment(TransactionRequestDTO request);
}
