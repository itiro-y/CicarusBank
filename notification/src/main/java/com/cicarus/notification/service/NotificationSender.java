package com.cicarus.notification.service;

import com.cicarus.notification.model.Notification;
import org.springframework.stereotype.Service;

@Service
public class NotificationSender {

    public void send(Notification notification) {
        System.out.printf("📩 Enviando %s para cliente %d: %s%n",
                notification.getChannel(), notification.getCustomerId(), notification.getMessage());
    }
}