package com.sicarus.account.dto;

import com.sicarus.account.model.LoanStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class FullLoanResponse {
    private Long id;
    private Long customerId;
    private BigDecimal principal;
    private Integer termMonths;
    private BigDecimal interestRate; // ex: 0.019 = 1.9% a.m.
    private LoanStatus status;       // “PENDING”, “APPROVED”, “REJECTED”
    private Instant createdAt;
    private List<FullInstallmentResponse> installments = new ArrayList<>();

    public FullLoanResponse() {

    }

    public FullLoanResponse(Long id, Long customerId, BigDecimal principal, Integer termMonths, BigDecimal interestRate, LoanStatus status, Instant createdAt, List<FullInstallmentResponse> installments) {
        this.id = id;
        this.customerId = customerId;
        this.principal = principal;
        this.termMonths = termMonths;
        this.interestRate = interestRate;
        this.status = status;
        this.createdAt = createdAt;
        this.installments = installments;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public BigDecimal getPrincipal() {
        return principal;
    }

    public void setPrincipal(BigDecimal principal) {
        this.principal = principal;
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

    public LoanStatus getStatus() {
        return status;
    }

    public void setStatus(LoanStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<FullInstallmentResponse> getInstallments() {
        return installments;
    }

    public void setInstallments(List<FullInstallmentResponse> installments) {
        this.installments = installments;
    }

    @Override
    public String toString() {
        return "Loan{" +
                "id=" + id +
                ", customerId=" + customerId +
                ", principal=" + principal +
                ", termMonths=" + termMonths +
                ", interestRate=" + interestRate +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
