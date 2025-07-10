package com.cicarus.notification.consumer;

import com.cicarus.notification.dto.NotificationDto;
import com.cicarus.notification.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public NotificationConsumer(ObjectMapper objectMapper, NotificationService notificationService) {
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = "transaction-topic", groupId = "notification-test", containerFactory = "kafkaListenerContainerFactory")
    public void consumir(String mensagemJson) {
        System.out.println("📦 JSON recebido: " + mensagemJson);

        try {
            NotificationDto dto = objectMapper.readValue(mensagemJson, NotificationDto.class);
            System.out.println("🔔 Mensagem recebida: " + dto.toString());
            notificationService.processNotification(dto);
        } catch (Exception e) {
            System.err.println("❌ Falha ao desserializar: " + e.getMessage());
        }


    }
}
