package com.sicarus.account.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private Long customerId;

    @Column
    private BigDecimal principal;

    @Column
    private Integer termMonths;

    @Column
    private BigDecimal interestRate; // ex: 0.019 = 1.9% a.m.

    @Column
    private LoanStatus status;       // “PENDING”, “APPROVED”, “REJECTED”

    @Column
    private Instant createdAt;

    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Installment> installments = new ArrayList<>();

    public Loan() {

    }

    public Loan(Long customerId, BigDecimal principal, Integer termMonths, BigDecimal interestRate, Instant createdAt) {
        this.customerId = customerId;
        this.principal = principal;
        this.termMonths = termMonths;
        this.interestRate = interestRate;
        this.status = LoanStatus.PENDING;
        this.createdAt = createdAt;
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

    public List<Installment> getInstallments() {
        return installments;
    }

    public void setInstallments(List<Installment> installments) {
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