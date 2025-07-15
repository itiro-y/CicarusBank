package com.cicarus.customer_service.dto;

import java.math.BigDecimal;

public class AccountRequest {
    private Long userId;
    private String accountType;
    private BigDecimal balance;

    public AccountRequest(Long id, String accountType){
        this.accountType=accountType;
        this.balance = BigDecimal.ZERO;
        this.userId=id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
