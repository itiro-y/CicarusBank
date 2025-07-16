package com.sicarus.account.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

@Entity
public class BalanceHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    @JsonBackReference
    private Account account;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private Date timestamp;

    public BalanceHistory() {
    }

    public BalanceHistory(Long id, Account account, BigDecimal balance, Date timestamp) {
        this.id = id;
        this.account = account;
        this.balance = balance;
        this.timestamp = timestamp;
    }

    public BalanceHistory(Account account, BigDecimal balance, Date timestamp) {
        this.account = account;
        this.balance = balance;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BalanceHistory that = (BalanceHistory) o;
        return Objects.equals(id, that.id) && Objects.equals(account, that.account) && Objects.equals(balance, that.balance) && Objects.equals(timestamp, that.timestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, account, balance, timestamp);
    }

    @Override
    public String toString() {
        return "BalanceHistory{" +
                "id=" + id +
                ", account=" + account +
                ", balance=" + balance +
                ", timestamp=" + timestamp +
                '}';
    }
}