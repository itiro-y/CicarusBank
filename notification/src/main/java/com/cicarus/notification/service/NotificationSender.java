package com.cicarus.notification.service;

import com.cicarus.notification.model.Notification;
import org.springframework.stereotype.Service;

@Service
public class NotificationSender {

    private final EmailSender emailSender;

    public NotificationSender(EmailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void send(Notification notification) {
        switch (notification.getChannel()) {
            case "EMAIL" -> emailSender.sendEmail(notification);
            case "SMS" -> System.out.println("📲 SMS enviado: " + notification.getMessage());
            case "PUSH" -> System.out.println("🔔 PUSH enviado: " + notification.getMessage());
        }
    }
}
