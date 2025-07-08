package com.cicarus.currency_exchange.dto;

import java.math.BigDecimal;

public class ConvertResponse {
    private String from;
    private String to;
    private BigDecimal rate;
    private BigDecimal originalAmount;
    private BigDecimal convertedAmount;

    public ConvertResponse(String from, String to, BigDecimal rate, BigDecimal originalAmount, BigDecimal convertedAmount) {
        this.from = from;
        this.to = to;
        this.rate = rate;
        this.originalAmount = originalAmount;
        this.convertedAmount = convertedAmount;
    }

    public ConvertResponse() {
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public BigDecimal getOriginalAmount() {
        return originalAmount;
    }

    public void setOriginalAmount(BigDecimal originalAmount) {
        this.originalAmount = originalAmount;
    }

    public BigDecimal getConvertedAmount() {
        return convertedAmount;
    }

    public void setConvertedAmount(BigDecimal convertedAmount) {
        this.convertedAmount = convertedAmount;
    }
}
