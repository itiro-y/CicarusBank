// Em: notification/src/main/java/com/cicarus/notification/dto/NotificationEvent.java

package com.cicarus.notification.dto;


public class NotificationEvent {
    private Long customerId;
    private String channel;
    private String message;
    private String recipientEmail; // Endereço de email para envio


    // Construtor sem argumentos
    public NotificationEvent() {
    }

    // Construtor com todos os argumentos
    public NotificationEvent(Long customerId, String channel, String message, String recipientEmail) {
        this.customerId = customerId;
        this.channel = channel;
        this.message = message;
        this.recipientEmail = recipientEmail;
    }

    // Getters e Setters

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

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}