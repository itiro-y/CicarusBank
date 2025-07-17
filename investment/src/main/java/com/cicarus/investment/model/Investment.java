package com.cicarus.investment.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

@Entity
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long accountId;

    @Column
    @Enumerated(EnumType.STRING)
    private InvestmentType type;

    @Column
    @Enumerated(EnumType.STRING)
    private InvestmentStatus status;

    @Column(name = "amount_invested")
    private BigDecimal amountInvested;

    @Column(name = "curren_value")
    private BigDecimal currentValue;

    @Column(name = "expected_return_rate")
    private BigDecimal expectedReturnRate;

    @Column(name = "start_date")
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Column(name = "end_date")
    @Temporal(TemporalType.DATE)
    private Date endDate;

    @Column
    private Boolean autoRenew;

    public Investment() {}

    public Investment(Long accountId, InvestmentType type, Long id, InvestmentStatus status, BigDecimal amountInvested, BigDecimal currentValue, BigDecimal expectedReturnRate, Date startDate, Date endDate, Boolean autoRenew) {
        this.accountId = accountId;
        this.type = type;
        this.id = id;
        this.status = status;
        this.amountInvested = amountInvested;
        this.currentValue = currentValue;
        this.expectedReturnRate = expectedReturnRate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.autoRenew = autoRenew;
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

    public InvestmentType getType() {
        return type;
    }

    public void setType(InvestmentType type) {
        this.type = type;
    }

    public InvestmentStatus getStatus() {
        return status;
    }

    public void setStatus(InvestmentStatus status) {
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

    public BigDecimal getExpectedReturnRate() {
        return expectedReturnRate;
    }

    public void setExpectedReturnRate(BigDecimal expectedReturnRate) {
        this.expectedReturnRate = expectedReturnRate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Boolean getAutoRenew() {
        return autoRenew;
    }

    public void setAutoRenew(Boolean autoRenew) {
        this.autoRenew = autoRenew;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Investment that = (Investment) o;
        return Objects.equals(id, that.id) && Objects.equals(accountId, that.accountId) && type == that.type && status == that.status && Objects.equals(amountInvested, that.amountInvested) && Objects.equals(currentValue, that.currentValue) && Objects.equals(expectedReturnRate, that.expectedReturnRate) && Objects.equals(startDate, that.startDate) && Objects.equals(endDate, that.endDate) && Objects.equals(autoRenew, that.autoRenew);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, accountId, type, status, amountInvested, currentValue, expectedReturnRate, startDate, endDate, autoRenew);
    }

    @Override
    public String toString() {
        return "Investment{" +
                "id=" + id +
                ", accountId=" + accountId +
                ", type=" + type +
                ", status=" + status +
                ", amountInvested=" + amountInvested +
                ", currentValue=" + currentValue +
                ", expectedReturnRate=" + expectedReturnRate +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", autoRenew=" + autoRenew +
                '}';
    }
}
