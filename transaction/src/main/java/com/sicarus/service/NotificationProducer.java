package com.sicarus.service;

import com.sicarus.dto.NotificationDto;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationProducer {
    private static final String TOPIC = "transaction-topic";

    private final KafkaTemplate<String, NotificationDto> kafkaTemplate;

    public NotificationProducer(KafkaTemplate<String, NotificationDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void send(NotificationDto message) {
        kafkaTemplate.send(TOPIC, message);
    }

    public NotificationDto getNotification() {
        NotificationDto notificationDto = new NotificationDto();

        notificationDto.setCustomerId(1L);
        notificationDto.setChannel("EMAIL");
        notificationDto.setMessage("Testandooooooooooooooooooooo");
        notificationDto.setRecipientEmail("kevin37614250@hotmail.com");

        return notificationDto;
    }
}
