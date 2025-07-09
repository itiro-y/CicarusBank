package com.sicarus.dto;

import java.time.Instant;

public class NotificationDto {
    private Long id;

    private Long customerId;
    private String channel;
    private String message;
    private Instant sentAt;

    private String recipientEmail; // <- opcional, útil para histórico

    public NotificationDto() {
    }

    public NotificationDto(Long id, Long customerId, String channel, String message, Instant sentAt) {
        this.id = id;
        this.customerId = customerId;
        this.channel = channel;
        this.message = message;
        this.sentAt = sentAt;
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
    public String getChannel() {
        return channel;
    }
    public void setChannel(String channel) {
        this.channel = channel;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public Instant getSentAt() {
        return sentAt;
    }
    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }
    public String getRecipientEmail() {
        return recipientEmail;
    }
    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
}
