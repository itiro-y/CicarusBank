package com.sicarus.account.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class InstallmentDTO {
    private int installmentNumber;
    private BigDecimal amount;
    private BigDecimal interest;
    private BigDecimal amortization;
    private BigDecimal remainingPrincipal;


    public InstallmentDTO() {
    }

    public InstallmentDTO(int installmentNumber, BigDecimal amount, BigDecimal interest, BigDecimal amortization, BigDecimal remainingPrincipal) {
        this.installmentNumber = installmentNumber;
        this.amount = amount;
        this.interest = interest;
        this.amortization = amortization;
        this.remainingPrincipal = remainingPrincipal;
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
}