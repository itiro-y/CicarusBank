package com.cicarus.notification.messaging;

import com.cicarus.notification.dto.NotificationEvent;
import com.cicarus.notification.service.NotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    private final NotificationService service;

    public NotificationListener(NotificationService service) {
        this.service = service;
    }

    @RabbitListener(queues = "events.notifications")
    public void listen(NotificationEvent event) {
        System.out.println("📥 Evento recebido: " + event.getMessage());
        service.processNotification(event);
    }
}
