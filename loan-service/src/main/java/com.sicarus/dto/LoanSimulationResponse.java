package com.sicarus.dto;

import java.math.BigDecimal;
import java.util.List;

public class LoanSimulationResponse {
    private BigDecimal principal;
    private BigDecimal totalInterest;
    private BigDecimal totalAmount;
    private List<InstallmentDTO> installments;

    public LoanSimulationResponse() {
    }

    public LoanSimulationResponse(BigDecimal principal, BigDecimal totalInterest, BigDecimal totalAmount, List<InstallmentDTO> installments) {
        this.principal = principal;
        this.totalInterest = totalInterest;
        this.totalAmount = totalAmount;
        this.installments = installments;
    }

    public BigDecimal getPrincipal() {
        return principal;
    }

    public void setPrincipal(BigDecimal principal) {
        this.principal = principal;
    }

    public BigDecimal getTotalInterest() {
        return totalInterest;
    }

    public void setTotalInterest(BigDecimal totalInterest) {
        this.totalInterest = totalInterest;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<InstallmentDTO> getInstallments() {
        return installments;
    }

    public void setInstallments(List<InstallmentDTO> installments) {
        this.installments = installments;
    }
}
