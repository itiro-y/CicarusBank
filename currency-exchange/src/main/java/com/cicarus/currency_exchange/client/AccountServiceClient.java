package com.cicarus.currency_exchange.client;

import com.cicarus.currency_exchange.dto.UpdateAccountBalancesRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "account")
public interface AccountServiceClient {

    @PutMapping("/account/update-balances")
    void updateAccountBalances(@RequestBody UpdateAccountBalancesRequest request);
}
