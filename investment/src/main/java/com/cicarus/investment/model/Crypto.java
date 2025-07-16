package com.cicarus.investment.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

@Entity
public class Crypto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_id")
    private Long accountId;

    @Column
    @Enumerated(EnumType.STRING)
    private CryptoType type;

    @Column
    @Enumerated(EnumType.STRING)
    private CryptoStatus status;

    @Column(name = "amount_invested")
    private BigDecimal amountInvested;

    @Column(name = "current_value")
    private BigDecimal currentValue;

    @Column(name = "crypto_multiplier")
    private BigDecimal CryptoMultiplier;

    @Column(name = "start_date")
    @Temporal(TemporalType.DATE)
    private Date startDate;

    public Crypto() {}

    public Crypto(Long id, Long accountId, CryptoType type, CryptoStatus status, BigDecimal amountInvested, BigDecimal currentValue, BigDecimal cryptoMultiplier, Date startDate) {
        this.id = id;
        this.accountId = accountId;
        this.type = type;
        this.status = status;
        this.amountInvested = amountInvested;
        this.currentValue = currentValue;
        CryptoMultiplier = cryptoMultiplier;
        this.startDate = startDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public CryptoType getType() {
        return type;
    }

    public void setType(CryptoType type) {
        this.type = type;
    }

    public CryptoStatus getStatus() {
        return status;
    }

    public void setStatus(CryptoStatus status) {
        this.status = status;
    }

    public BigDecimal getAmountInvested() {
        return amountInvested;
    }

    public void setAmountInvested(BigDecimal amountInvested) {
        this.amountInvested = amountInvested;
    }

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
    }

    public BigDecimal getCryptoMultiplier() {
        return CryptoMultiplier;
    }

    public void setCryptoMultiplier(BigDecimal cryptoMultiplier) {
        CryptoMultiplier = cryptoMultiplier;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Crypto that = (Crypto) o;
        return Objects.equals(id, that.id) && Objects.equals(accountId, that.accountId) && type == that.type && status == that.status && Objects.equals(amountInvested, that.amountInvested) && Objects.equals(currentValue, that.currentValue) && Objects.equals(CryptoMultiplier, that.CryptoMultiplier) && Objects.equals(startDate, that.startDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, accountId, type, status, amountInvested, currentValue, CryptoMultiplier, startDate);
    }

    @Override
    public String toString() {
        return "Crypto{" +
                "id=" + id +
                ", accountId=" + accountId +
                ", type=" + type +
                ", status=" + status +
                ", amountInvested=" + amountInvested +
                ", currentValue=" + currentValue +
                ", CryptoMultiplier=" + CryptoMultiplier +
                ", startDate=" + startDate +
                '}';
    }
}
