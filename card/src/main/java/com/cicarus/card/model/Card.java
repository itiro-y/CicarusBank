package com.cicarus.card.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "card_number")
    private String cardNumber;

    @Column
    @Temporal(TemporalType.DATE)
    private Date expiry;

    @Column(name = "credit_limit")
    private BigDecimal creditLimit;

    @Column
    @Enumerated(EnumType.STRING)
    private CardStatus status;

    @Column(name = "cardholder_name")
    private String cardholderName;

    @Column
    private String network; 

    @Column(name = "card_type")
    private String cardType;  

    @Column(name = "cvv_hash")
    private String cvvHash;

    @Column(name = "last_4_digits")
    private String last4Digits;

    public Card() {}

    public Card(Long id, Long customerId, String cardNumber, Date expiry, BigDecimal creditLimit, CardStatus status,
                String cardholderName, String network, String cardType, String cvvHash, String last4Digits) {
        this.id = id;
        this.customerId = customerId;
        this.cardNumber = cardNumber;
        this.expiry = expiry;
        this.creditLimit = creditLimit;
        this.status = status;
        this.cardholderName = cardholderName;
        this.network = network;
        this.cardType = cardType;
        this.cvvHash = cvvHash;
        this.last4Digits = last4Digits;
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

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public Date getExpiry() {
        return expiry;
    }

    public void setExpiry(Date expiry) {
        this.expiry = expiry;
    }

    public BigDecimal getCreditLimit() {
        return creditLimit;
    }

    public void setCreditLimit(BigDecimal creditLimit) {
        this.creditLimit = creditLimit;
    }

    public CardStatus getStatus() {
        return status;
    }

    public void setStatus(CardStatus status) {
        this.status = status;
    }

    public String getCardholderName() {
        return cardholderName;
    }

    public void setCardholderName(String cardholderName) {
        this.cardholderName = cardholderName;
    }

    public String getNetwork() {
        return network;
    }

    public void setNetwork(String network) {
        this.network = network;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public String getCvvHash() {
        return cvvHash;
    }

    public void setCvvHash(String cvvHash) {
        this.cvvHash = cvvHash;
    }

    public String getLast4Digits() {
        return last4Digits;
    }

    public void setLast4Digits(String last4Digits) {
        this.last4Digits = last4Digits;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Card card = (Card) o;
        return Objects.equals(id, card.id) && Objects.equals(customerId, card.customerId) && Objects.equals(cardNumber, card.cardNumber) && Objects.equals(expiry, card.expiry) && Objects.equals(creditLimit, card.creditLimit) && status == card.status && Objects.equals(cardholderName, card.cardholderName) && Objects.equals(network, card.network) && Objects.equals(cardType, card.cardType) && Objects.equals(cvvHash, card.cvvHash) && Objects.equals(last4Digits, card.last4Digits);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customerId, cardNumber, expiry, creditLimit, status, cardholderName, network, cardType, cvvHash, last4Digits);
    }

    @Override
    public String toString() {
        return "Card{" +
                "id=" + id +
                ", customerId=" + customerId +
                ", cardNumber='" + cardNumber + '\'' +
                ", expiry=" + expiry +
                ", creditLimit=" + creditLimit +
                ", status=" + status +
                ", cardholderName='" + cardholderName + '\'' +
                ", network='" + network + '\'' +
                ", cardType='" + cardType + '\'' +
                ", cvvHash='" + cvvHash + '\'' +
                ", last4Digits='" + last4Digits + '\'' +
                '}';
    }
}
