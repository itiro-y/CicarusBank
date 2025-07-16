package com.sicarus.account.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class FullInstallmentResponse {
    private Long id;
    private int installmentNumber;
    private BigDecimal amount;
    private BigDecimal interest;
    private BigDecimal amortization;
    private BigDecimal remainingPrincipal;
    private LocalDate dueDate;

    //Controle se a parcela foi paga ou não
    private Boolean paid;
    private LocalDateTime paidAt;


    public FullInstallmentResponse() {
    }

    public FullInstallmentResponse(int installmentNumber, BigDecimal amount, BigDecimal interest, BigDecimal amortization, BigDecimal remainingPrincipal, LocalDate dueDate, Boolean paid, LocalDateTime paidAt) {
        this.installmentNumber = installmentNumber;
        this.amount = amount;
        this.interest = interest;
        this.amortization = amortization;
        this.remainingPrincipal = remainingPrincipal;
        this.dueDate = dueDate;
        this.paid = paid;
        this.paidAt = paidAt;
    }

    public int getInstallmentNumber() {
        return installmentNumber;
    }

    public void setInstallmentNumber(int installmentNumber) {
        this.installmentNumber = installmentNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getInterest() {
        return interest;
    }

    public void setInterest(BigDecimal interest) {
        this.interest = interest;
    }

    public BigDecimal getAmortization() {
        return amortization;
    }

    public void setAmortization(BigDecimal amortization) {
        this.amortization = amortization;
    }

    public BigDecimal getRemainingPrincipal() {
        return remainingPrincipal;
    }

    public void setRemainingPrincipal(BigDecimal remainingPrincipal) {
        this.remainingPrincipal = remainingPrincipal;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Boolean getPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public Long getId() {
        return id;
    }
}
