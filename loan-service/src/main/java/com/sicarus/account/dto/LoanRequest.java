package com.sicarus.account.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LoanRequest {
    private Long customerId;
    private BigDecimal amount;
    private Integer termMonths;
    private BigDecimal interestRate;
    private LocalDate dueDate;

    public LoanRequest() {
    }

    public LoanRequest(Long customerId, BigDecimal amount, Integer termMonths, BigDecimal interestRate, LocalDate dueDate) {
        this.customerId = customerId;
        this.amount = amount;
        this.termMonths = termMonths;
        this.interestRate = interestRate;
        this.dueDate = dueDate;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getTermMonths() {
        return termMonths;
    }

    public void setTermMonths(Integer termMonths) {
        this.termMonths = termMonths;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
