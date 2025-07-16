package com.sicarus.account.dto;

import java.math.BigDecimal;

public class SimulateLoanRequest {
    BigDecimal principal;
    int termMonths;
    BigDecimal interestRate; // Ex: 0.019 para 1.9% ao mês

    public SimulateLoanRequest() {
    }

    public SimulateLoanRequest(BigDecimal principal, int termMonths, BigDecimal interestRate) {
        this.principal = principal;
        this.termMonths = termMonths;
        this.interestRate = interestRate;
    }

    public BigDecimal getPrincipal() {
        return principal;
    }

    public void setPrincipal(BigDecimal principal) {
        this.principal = principal;
    }

    public int getTermMonths() {
        return termMonths;
    }

    public void setTermMonths(int termMonths) {
        this.termMonths = termMonths;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }
}