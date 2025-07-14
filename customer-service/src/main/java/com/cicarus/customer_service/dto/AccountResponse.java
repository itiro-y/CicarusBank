package com.cicarus.customer_service.dto;

import java.math.BigDecimal;

public class AccountResponse {
    private Long id;
    private Long userId;
    private String type;
    private BigDecimal balance;
    private BigDecimal usdWallet;
    private BigDecimal eurWallet;

    public AccountResponse(){

    }

    public AccountResponse(Long id, Long userId, String type, BigDecimal balance, BigDecimal usdWallet, BigDecimal eurWallet) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.balance = balance;
        this.usdWallet = usdWallet;
        this.eurWallet = eurWallet;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public BigDecimal getUsdWallet() {
        return usdWallet;
    }

    public void setUsdWallet(BigDecimal usdWallet) {
        this.usdWallet = usdWallet;
    }

    public BigDecimal getEurWallet() {
        return eurWallet;
    }

    public void setEurWallet(BigDecimal eurWallet) {
        this.eurWallet = eurWallet;
    }
}
