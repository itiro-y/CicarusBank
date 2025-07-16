package com.cicarus.notification.model;

import com.cicarus.notification.dto.NotificationMessageDto;
import jakarta.persistence.*;

@Entity
@Table(name = "notification_model")
public class NotificationModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String title;
    private String message;
    private String fullDescription;
    private String timestamp;

    @Column(name = "read_flag")
    private boolean read;

    public NotificationModel() {
    }

    public NotificationModel(Long userId, String title, String message, String fullDescription, String timestamp) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.fullDescription = fullDescription;
        this.timestamp = timestamp;
        this.read = false;
    }

    public NotificationModel(NotificationMessageDto notificationMessageDto) {
        this.userId = notificationMessageDto.getUserId();
        this.title = notificationMessageDto.getTitle();
        this.message = notificationMessageDto.getMessage();
        this.fullDescription = notificationMessageDto.getFullDescription();
        this.timestamp = notificationMessageDto.getTimestamp();
        this.read = false;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public String getFullDescription() {
        return fullDescription;
    }

    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
    }
}
