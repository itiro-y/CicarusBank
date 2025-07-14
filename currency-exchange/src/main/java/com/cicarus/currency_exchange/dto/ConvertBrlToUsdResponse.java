package com.cicarus.currency_exchange.dto;

import java.math.BigDecimal;

public class ConvertBrlToUsdResponse {
    private BigDecimal originalBrlAmount;
    private BigDecimal convertedUsdAmount;
    private BigDecimal exchangeRate;

    public ConvertBrlToUsdResponse(BigDecimal originalBrlAmount, BigDecimal convertedUsdAmount, BigDecimal exchangeRate) {
        this.originalBrlAmount = originalBrlAmount;
        this.convertedUsdAmount = convertedUsdAmount;
        this.exchangeRate = exchangeRate;
    }

    public BigDecimal getOriginalBrlAmount() {
        return originalBrlAmount;
    }

    public void setOriginalBrlAmount(BigDecimal originalBrlAmount) {
        this.originalBrlAmount = originalBrlAmount;
    }

    public BigDecimal getConvertedUsdAmount() {
        return convertedUsdAmount;
    }

    public void setConvertedUsdAmount(BigDecimal convertedUsdAmount) {
        this.convertedUsdAmount = convertedUsdAmount;
    }

    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(BigDecimal exchangeRate) {
        this.exchangeRate = exchangeRate;
    }
}
