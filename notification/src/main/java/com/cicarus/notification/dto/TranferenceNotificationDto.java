package com.cicarus.notification.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class TranferenceNotificationDto {
    private String tipo;
    private Long customerId;
    private String customerName;
    private Long customerToId;
    private String customerToName;
    private Long accountToId;
    private String recipientEmail;
    private String channel;
    private BigDecimal amount;
    private Instant dateTime;
    private String body;

    public TranferenceNotificationDto() {
    }

    public TranferenceNotificationDto(String tipo, Long customerId, String customerName, Long customerToId, String customerToName, Long accountToId, String recipientEmail, String channel, BigDecimal amount, Instant dateTime, String body) {
        this.tipo = tipo;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerToId = customerToId;
        this.customerToName = customerToName;
        this.accountToId = accountToId;
        this.recipientEmail = recipientEmail;
        this.channel = channel;
        this.amount = amount;
        this.dateTime = dateTime;
        this.body = body;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
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

    public Long getCustomerToId() {
        return customerToId;
    }

    public void setCustomerToId(Long customerToId) {
        this.customerToId = customerToId;
    }

    public String getCustomerToName() {
        return customerToName;
    }

    public void setCustomerToName(String customerToName) {
        this.customerToName = customerToName;
    }

    public Long getAccountToId() {
        return accountToId;
    }

    public void setAccountToId(Long accountToId) {
        this.accountToId = accountToId;
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
