package com.sicarus.account.dto;

import java.math.BigDecimal;

public class UpdateAccountBalancesRequest {
    private Long accountId;
    private BigDecimal brlAmount;
    private BigDecimal usdAmount;
    public UpdateAccountBalancesRequest() {
    }

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

    public BigDecimal getUsdAmount() {
        return usdAmount;
    }

    public void setUsdAmount(BigDecimal usdAmount) {
        this.usdAmount = usdAmount;
    }
}
