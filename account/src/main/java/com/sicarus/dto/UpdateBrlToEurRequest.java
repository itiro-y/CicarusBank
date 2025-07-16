package com.sicarus.dto;

import java.math.BigDecimal;

public class UpdateBrlToEurRequest {
    public UpdateBrlToEurRequest() {
    }

    private Long accountId;
    private BigDecimal brlAmount;
    private BigDecimal eurAmount;

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public BigDecimal getBrlAmount() {
        return brlAmount;
    }

    public void setBrlAmount(BigDecimal brlAmount) {
        this.brlAmount = brlAmount;
    }

    public BigDecimal getEurAmount() {
        return eurAmount;
    }

    public void setEurAmount(BigDecimal eurAmount) {
        this.eurAmount = eurAmount;
    }
}
