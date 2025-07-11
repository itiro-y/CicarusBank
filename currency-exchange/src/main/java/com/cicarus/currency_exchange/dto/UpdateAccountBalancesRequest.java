package com.cicarus.currency_exchange.dto;

import java.math.BigDecimal;

public class UpdateAccountBalancesRequest {
    private Long userId;
    private BigDecimal brlAmount;
    private BigDecimal usdAmount;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BigDecimal getBrlAmount() {
        return brlAmount;
    }

    public void setBrlAmount(BigDecimal brlAmount) {
        this.brlAmount = brlAmount;
    }

    public BigDecimal getUsdAmount() {
        return usdAmount;
    }

    public void setUsdAmount(BigDecimal usdAmount) {
        this.usdAmount = usdAmount;
    }
}
