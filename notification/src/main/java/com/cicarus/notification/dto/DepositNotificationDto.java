package com.cicarus.notification.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class DepositNotificationDto {
    private String tipo;
    private Long customerId;
    private String customerName;
    private String recipientEmail;
    private String channel;
    private BigDecimal amount;
    private Instant dateTime;
    private String body;

    public DepositNotificationDto() {
    }

    public DepositNotificationDto(String templateType, Long customerId, String customerName, String recipientEmail, String channel, BigDecimal amount, Instant dateTime,  String body) {
        this.tipo = templateType;
        this.customerId = customerId;
        this.customerName = customerName;
        this.recipientEmail = recipientEmail;
        this.channel = channel;
        this.amount = amount;
        this.dateTime = dateTime;
        this.body = body;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTemplateType(String tipo) {
        this.tipo = tipo;
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

}
