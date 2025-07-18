package com.cicarus.notification.dto;

import com.cicarus.notification.model.NotificationModel;

public class NotificationMessageDto {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String fullDescription;
    private String timestamp;
    private boolean read;

    public NotificationMessageDto() {
    }

    public NotificationMessageDto(Long userId, String title, String message, String fullDescription, String timestamp, boolean read) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.fullDescription = fullDescription;
        this.timestamp = timestamp;
        this.read = read;
    }

    public NotificationMessageDto(Long id, Long userId, String title, String message, String fullDescription, String timestamp, boolean read) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.fullDescription = fullDescription;
        this.timestamp = timestamp;
        this.read = read;
    }

    public NotificationMessageDto(NotificationModel notificationModel) {
        this.id = notificationModel.getId();
        this.userId = notificationModel.getUserId();
        this.title = notificationModel.getTitle();
        this.message = notificationModel.getMessage();
        this.fullDescription = notificationModel.getFullDescription();
        this.timestamp = notificationModel.getTimestamp();
        this.read = notificationModel.isRead();
    }

    public static NotificationMessageDto fromEntity(NotificationModel entity) {
        return new NotificationMessageDto(
                entity.getId(),
                entity.getId(),
                entity.getTitle(),
                entity.getMessage(),
                entity.getFullDescription(),
                entity.getTimestamp().toString(),
                entity.isRead()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    @Override
    public String toString() {
        return "NotificationMessageDto{" +
                "id=" + id +
                ", userId=" + userId +
                ", title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", fullDescription='" + fullDescription + '\'' +
                ", timestamp='" + timestamp + '\'' +
                ", read=" + read +
                '}';
    }
}
