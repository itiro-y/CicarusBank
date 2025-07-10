package com.cicarus.notification.consumer;

import com.cicarus.notification.dto.DepositNotificationDto;
import com.cicarus.notification.dto.NotificationDto;
import com.cicarus.notification.service.EmailBodyService;
import com.cicarus.notification.service.NotificationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;
    private final EmailBodyService emailBodyService;

    public NotificationConsumer(ObjectMapper objectMapper, NotificationService notificationService,  EmailBodyService emailBodyService) {
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
        this.emailBodyService = emailBodyService;
    }

    @KafkaListener(topics = "transaction-topic", groupId = "notification-test", containerFactory = "kafkaListenerContainerFactory")
    public void consumir(String mensagemJson) {
        System.out.println("📦 JSON recebido: " + mensagemJson);

        try{
            JsonNode root = objectMapper.readTree(mensagemJson);
            JsonNode typeNode = root.get("type");
            if (typeNode == null || typeNode.isNull()) {
                System.err.println("❌ Campo 'type' ausente no JSON.");
                return;
            }
            String tipo = typeNode.asText();

            switch (tipo) {
                case "deposit":
                    DepositNotificationDto dto = objectMapper.treeToValue(root, DepositNotificationDto.class);
                    dto.setBody(emailBodyService.generateDepositBody(dto));

                    NotificationDto notificationDto = new NotificationDto(dto);

                    notificationService.processNotification(notificationDto);
                    break;
                default:
                    System.out.println("ERRO: Tipo invalido");
            }
        }catch (Exception e) {
            System.err.println("❌ falha ao ler o tipo: " + e.getMessage());
        }

    }
}
