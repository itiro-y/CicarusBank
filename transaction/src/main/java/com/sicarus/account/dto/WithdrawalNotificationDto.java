package com.sicarus.account.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class WithdrawalNotificationDto {
    private String type = "withdrawal";
    private Long customerId;
    private String customerName;
    private String recipientEmail;
    private String channel;
    private BigDecimal amount;
    private Instant dateTime;
    private String body;

    public WithdrawalNotificationDto() {
    }

    public WithdrawalNotificationDto(String type, Long customerId, String customerName, String recipientEmail, String channel, BigDecimal amount, Instant dateTime, String body) {
        this.type = type;
        this.customerId = customerId;
        this.customerName = customerName;
        this.recipientEmail = recipientEmail;
        this.channel = channel;
        this.amount = amount;
        this.dateTime = dateTime;
        this.body = body;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Instant getDateTime() {
        return dateTime;
    }

    public void setDateTime(Instant dateTime) {
        this.dateTime = dateTime;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    @Override
    public String toString() {
        return "DepositNotificationDto{" +
                "type='" + type + '\'' +
                ", customerId=" + customerId +
                ", customerName='" + customerName + '\'' +
                ", recipientEmail='" + recipientEmail + '\'' +
                ", channel='" + channel + '\'' +
                ", amount=" + amount +
                ", dateTime=" + dateTime +
                ", body='" + body + '\'' +
                '}';
    }
}
