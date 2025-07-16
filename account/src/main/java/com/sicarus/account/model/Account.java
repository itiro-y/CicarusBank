package com.sicarus.account.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sicarus.account.enums.AccountType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
//id userId type balance
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private BigDecimal usdWallet;

    @Column(nullable = false)
    private BigDecimal eurWallet;
    @OneToMany(
            mappedBy = "account",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @JsonManagedReference
    private List<BalanceHistory> balanceHistory;

    public Account() {
        this.usdWallet = BigDecimal.ZERO;
        this.eurWallet = BigDecimal.ZERO;
    }

    public List<BalanceHistory> getBalanceHistory() {
        return balanceHistory;
    }

    public void setBalanceHistory(List<BalanceHistory> balanceHistory) {
        this.balanceHistory = balanceHistory;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public AccountType getType() {
        return type;
    }

    public void setType(AccountType type) {
        this.type = type;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public BigDecimal getUsdWallet() {
        return usdWallet;
    }

    public void setUsdWallet(BigDecimal usdWallet) {
        this.usdWallet = usdWallet;
    }

    public BigDecimal getEurWallet() {
        return eurWallet;
    }

    public void setEurWallet(BigDecimal eurWallet) {
        this.eurWallet = eurWallet;
    }
}
