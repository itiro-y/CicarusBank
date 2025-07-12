package com.sicarus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sicarus.enums.AccountType;
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

    public Account(){
        this.usdWallet = BigDecimal.ZERO;
    }
  
    @OneToMany(
            mappedBy = "account",
            cascade   = CascadeType.ALL,
            orphanRemoval = true,
            fetch     = FetchType.LAZY
    )
    @JsonManagedReference
    private List<BalanceHistory> balanceHistory;

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
}
