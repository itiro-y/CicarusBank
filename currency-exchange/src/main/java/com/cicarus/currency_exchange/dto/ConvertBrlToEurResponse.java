package com.cicarus.currency_exchange.dto;

import java.math.BigDecimal;

public class ConvertBrlToEurResponse {
    private BigDecimal originalBrlAmount;
    private BigDecimal convertedEurAmount;
    private BigDecimal exchangeRate;

    public ConvertBrlToEurResponse(BigDecimal originalBrlAmount, BigDecimal convertedEurAmount, BigDecimal exchangeRate) {
        this.originalBrlAmount = originalBrlAmount;
        this.convertedEurAmount = convertedEurAmount;
        this.exchangeRate = exchangeRate;
    }

    public BigDecimal getOriginalBrlAmount() {
        return originalBrlAmount;
    }

    public void setOriginalBrlAmount(BigDecimal originalBrlAmount) {
        this.originalBrlAmount = originalBrlAmount;
    }

    public BigDecimal getConvertedEurAmount() {
        return convertedEurAmount;
    }

    public void setConvertedEurAmount(BigDecimal convertedEurAmount) {
        this.convertedEurAmount = convertedEurAmount;
    }

    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(BigDecimal exchangeRate) {
        this.exchangeRate = exchangeRate;
    }
}
