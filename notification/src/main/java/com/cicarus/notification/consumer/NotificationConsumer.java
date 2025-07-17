package com.cicarus.notification.consumer;

import com.cicarus.notification.dto.*;
import com.cicarus.notification.service.EmailBodyService;
import com.cicarus.notification.service.EmailNotificationService;
import com.cicarus.notification.service.WebSocketNotificationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {

    private final ObjectMapper objectMapper;
    private final EmailNotificationService emailNotificationService;
    private final EmailBodyService emailBodyService;
    private final WebSocketNotificationService webSocketNotificationService;

    public NotificationConsumer(ObjectMapper objectMapper, EmailNotificationService emailNotificationService, EmailBodyService emailBodyService, WebSocketNotificationService webSocketNotificationService) {
        this.objectMapper = objectMapper;
        this.emailNotificationService = emailNotificationService;
        this.emailBodyService = emailBodyService;
        this.webSocketNotificationService = webSocketNotificationService;
    }

    @KafkaListener(topics = "transaction-topic", groupId = "notification-test", containerFactory = "kafkaListenerContainerFactory")
    public void consumir(String mensagemJson) {
        System.out.println("📦 JSON recebido: " + mensagemJson);

        try{
            JsonNode root = objectMapper.readTree(mensagemJson);
            JsonNode typeNode = root.get("type");
            if (typeNode == null || typeNode.isNull()) {
                System.err.println("Campo 'type' ausente no JSON.");
                return;
            }
            String tipo = typeNode.asText();

            switch (tipo) {
                case "deposit":
                    DepositNotificationDto dto = objectMapper.treeToValue(root, DepositNotificationDto.class);

                    // Enviar notificação WebSocket
                    try {
                        webSocketNotificationService.processNotification(dto);
                    } catch (Exception e) {
                        System.out.println("Erro ao enviar notificação in-app: {" + e.getMessage() +"}");
                    }

                    //Encaminhamento para envio via email
                    try {
                        emailNotificationService.processNotification(dto);
                    } catch (Exception e) {
                        System.out.println("Erro ao enviar e-mail: {" + e.getMessage() +"}");
                    }

                    break;
                case "tranference":
                    TranferenceNotificationDto dto2 = objectMapper.treeToValue(root, TranferenceNotificationDto.class);

                    // Enviar notificação WebSocket
                    try {
                        webSocketNotificationService.processNotification(dto2);
                    } catch (Exception e) {
                        System.out.println("Erro ao enviar notificação in-app: {" + e.getMessage() +"}");
                    }

                    //Encaminhamento para envio via email
                    try {
                        emailNotificationService.processNotification(dto2);
                    } catch (Exception e) {
                        System.out.println("Erro ao enviar e-mail: {" + e.getMessage() +"}");
                    }

                    break;
                case "withdrawal":
                    WithdrawalNotificationDto dto3 = objectMapper.treeToValue(root, WithdrawalNotificationDto.class);

                    // Enviar notificação WebSocket
                    try {
                        webSocketNotificationService.processNotification(dto3);
                    } catch (Exception e) {
                        System.out.println("Erro ao enviar notificação in-app: {" + e.getMessage() +"}");
                    }

                    //Encaminhamento para envio via email
                    try {
                        emailNotificationService.processNotification(dto3);
                    } catch (Exception e) {
                        System.out.println("Erro ao enviar e-mail: {" + e.getMessage() +"}");
                    }

                    break;
                default:
                    System.out.println("ERRO: Tipo invalido");
            }
        }catch (Exception e) {
            System.err.println("❌ falha ao ler o tipo: " + e.getMessage());
        }

    }
}
