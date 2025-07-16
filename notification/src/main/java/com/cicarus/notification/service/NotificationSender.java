package com.cicarus.notification.service;

import com.cicarus.notification.model.EmailModel;
import org.springframework.stereotype.Service;

@Service
public class NotificationSender {

    private final EmailSender emailSender;

    public NotificationSender(EmailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void send(EmailModel emailModel) {
        switch (emailModel.getChannel()) {
            case "EMAIL" -> emailSender.sendEmail(emailModel);
            case "SMS" -> System.out.println("📲 SMS enviado: " + emailModel.getMessage());
            case "PUSH" -> System.out.println("🔔 PUSH enviado: " + emailModel.getMessage());
        }
    }
}
