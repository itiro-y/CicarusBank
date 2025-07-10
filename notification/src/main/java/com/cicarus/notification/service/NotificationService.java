package com.cicarus.notification.service;

import com.cicarus.notification.dto.NotificationEvent;
import com.cicarus.notification.model.Notification;
import com.cicarus.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final NotificationSender sender;


    public NotificationService(NotificationRepository repository, NotificationSender sender) {
        this.repository = repository;
        this.sender = sender;
    }

    public void processNotification(NotificationEvent event) {
        Notification notification = new Notification(
                event.getCustomerId(),
                event.getChannel(),
                event.getMessage(),
                event.getRecipientEmail(),
                Instant.now());

        repository.save(notification);
        sender.send(notification);
    }

    public NotificationRepository getRepository() {
        return repository;
    }

    public NotificationSender getSender() {
        return sender;
    }


}
