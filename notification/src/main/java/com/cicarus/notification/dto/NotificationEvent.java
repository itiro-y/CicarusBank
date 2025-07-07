package com.cicarus.notification.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private Long customerId;
    private String channel;
    private String message;
}