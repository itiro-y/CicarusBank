package com.sicarus.account.statement_service.clients;

import com.sicarus.account.statement_service.dtos.TransactionDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "transaction", path = "/transaction")
public interface TransactionClient {

    @GetMapping
    List<TransactionDto> getAllTransactions();

    @GetMapping("/accounts/{accountId}")
    List<TransactionDto> getAllTransactionsByAccountId(@PathVariable("accountId") Long accountId);
}
