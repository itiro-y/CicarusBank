package com.sicarus.account.dto;

public class NotificationDto {
    private Long customerId;
    private String channel;
    private String body;
    private String recipientEmail;

    public NotificationDto() {
    }

    public NotificationDto(Long customerId, String channel, String body, String recipientEmail) {
        this.customerId = customerId;
        this.channel = channel;
        this.body = body;
        this.recipientEmail = recipientEmail;
    }

    public NotificationDto(DepositNotificationDto depositNotificationDto) {
        this.customerId = depositNotificationDto.getCustomerId();
        this.channel = depositNotificationDto.getChannel();
        this.body = depositNotificationDto.getBody();
        this.recipientEmail = depositNotificationDto.getRecipientEmail();
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

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
}
