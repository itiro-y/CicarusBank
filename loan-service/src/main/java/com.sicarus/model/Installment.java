package com.sicarus.model;

import com.sicarus.dto.InstallmentDTO;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Installment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int installmentNumber;
    private BigDecimal amount;
    private BigDecimal interest;
    private BigDecimal amortization;
    private BigDecimal remainingPrincipal;
    private LocalDate dueDate;

    //Controle se a parcela foi paga ou não
    private Boolean paid = false;
    private LocalDateTime paidAt;

    @ManyToOne
    @JoinColumn(name = "loan_id")
    private Loan loan;


    public Installment() {
    }

    public Installment(int installmentNumber, BigDecimal amount, BigDecimal interest, BigDecimal amortization, BigDecimal remainingPrincipal, LocalDate dueDate, Loan loan) {
        this.installmentNumber = installmentNumber;
        this.amount = amount;
        this.interest = interest;
        this.amortization = amortization;
        this.remainingPrincipal = remainingPrincipal;
        this.dueDate = dueDate;
        this.loan = loan;
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

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }
}
