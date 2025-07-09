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
}
