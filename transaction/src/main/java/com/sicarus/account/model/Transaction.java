package com.sicarus.account.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "transaction")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "transaction_type")
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Column
    private BigDecimal amount;

    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TransactionStatus transactionStatus;

    public Transaction() {
    }

    public Transaction(Long id, Long accountId, TransactionType transactionType, BigDecimal amount, Date timestamp) {
        this.id = id;
        this.accountId = accountId;
        this.transactionType = transactionType;
        this.amount = amount;
        this.timestamp = timestamp;
        this.setTransactionStatus(TransactionStatus.COMPLETED);
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

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public TransactionStatus getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(TransactionStatus transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Transaction that = (Transaction) o;
        return Objects.equals(id, that.id) && Objects.equals(accountId, that.accountId) && transactionType == that.transactionType && Objects.equals(amount, that.amount) && Objects.equals(timestamp, that.timestamp) && transactionStatus == that.transactionStatus;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, accountId, transactionType, amount, timestamp, transactionStatus);
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "id=" + id +
                ", accountId=" + accountId +
                ", transactionType=" + transactionType +
                ", amount=" + amount +
                ", timestamp=" + timestamp +
                ", transactionStatus=" + transactionStatus +
                '}';
    }
}
