// Em: notification/src/main/java/com/cicarus/notification/model/Notification.java

package com.cicarus.notification.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private String channel;

    @Column(nullable = false, length = 1000)
    private String message;

    private Instant sentAt;
    private String recipientEmail;

    // 1. Construtor sem argumentos (necessário para o JPA)
    public Notification() {
    }

    // 2. Construtor com todos os argumentos (útil para testes)
    public Notification(Long id, Long customerId, String channel, String message, Instant sentAt, String recipientEmail) {
        this.id = id;
        this.customerId = customerId;
        this.channel = channel;
        this.message = message;
        this.sentAt = sentAt;
        this.recipientEmail = recipientEmail;
    }
  
    public Notification(Long customerId, String channel, String message, String recipientEmail, Instant sentAt) {
        this.customerId = customerId;
        this.channel = channel;
        this.message = message;
        this.recipientEmail = recipientEmail;
        this.sentAt = sentAt;
    }

    // 3. Getters e Setters para todos os campos
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

    // 4. Implementação manual do padrão Builder
    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public static class NotificationBuilder {
        private Long customerId;
        private String channel;
        private String message;
        private Instant sentAt;
        private String recipientEmail;

        public NotificationBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public NotificationBuilder channel(String channel) {
            this.channel = channel;
            return this;
        }

        public NotificationBuilder message(String message) {
            this.message = message;
            return this;
        }

        public NotificationBuilder sentAt(Instant sentAt) {
            this.sentAt = sentAt;
            return this;
        }

        public NotificationBuilder recipientEmail(String recipientEmail) {
            this.recipientEmail = recipientEmail;
            return this;
        }

        public Notification build() {
            Notification notification = new Notification();
            notification.setCustomerId(this.customerId);
            notification.setChannel(this.channel);
            notification.setMessage(this.message);
            notification.setSentAt(this.sentAt);
            notification.setRecipientEmail(this.recipientEmail);
            return notification;
        }
    }
}