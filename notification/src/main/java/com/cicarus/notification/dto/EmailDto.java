package com.cicarus.notification.dto;

public class EmailDto {
    private Long customerId;
    private String channel;
    private String message;
    private String recipientEmail;

    public EmailDto() {
    }

    public EmailDto(Long customerId, String channel, String message, String recipientEmail) {
        this.customerId = customerId;
        this.channel = channel;
        this.message = message;
        this.recipientEmail = recipientEmail;
    }

    public EmailDto(DepositNotificationDto dto) {
        this.customerId = dto.getCustomerId();
        this.channel = dto.getChannel();
        this.message = dto.getBody();
        this.recipientEmail = dto.getRecipientEmail();
    }

    public EmailDto(TranferenceNotificationDto dto) {
        this.customerId = dto.getCustomerId();
        this.channel = dto.getChannel();
        this.message = dto.getBody();
        this.recipientEmail = dto.getRecipientEmail();
    }

    public EmailDto(WithdrawalNotificationDto dto) {
        this.customerId = dto.getCustomerId();
        this.channel = dto.getChannel();
        this.message = dto.getBody();
        this.recipientEmail = dto.getRecipientEmail();
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
    public String getRecipientEmail() {
        return recipientEmail;
    }
    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    @Override
    public String toString() {
        return "NotificationDto{" +
                "customerId=" + customerId +
                ", channel='" + channel + '\'' +
                ", message='" + message + '\'' +
                ", recipientEmail='" + recipientEmail + '\'' +
                '}';
    }
}
