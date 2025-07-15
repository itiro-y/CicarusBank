package com.cicarus.notification.service;

import com.cicarus.notification.dto.DepositNotificationDto;
import com.cicarus.notification.dto.NotificationMessageDto;
import com.cicarus.notification.dto.TranferenceNotificationDto;
import com.cicarus.notification.dto.WithdrawalNotificationDto;
import com.cicarus.notification.model.NotificationModel;
import com.cicarus.notification.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebSocketNotificationService {
    private SimpMessagingTemplate messagingTemplate;
    private NotificationRepository notificationRepository;

    public WebSocketNotificationService(SimpMessagingTemplate messagingTemplate, NotificationRepository notificationRepository) {
        this.messagingTemplate = messagingTemplate;
        this.notificationRepository = notificationRepository;
    }

    public void processNotification(DepositNotificationDto dto) {
        NotificationMessageDto notificationdto = new NotificationMessageDto(
                dto.getCustomerId(),
                "Novo depósito em sua conta",
                "Você recebeu R$" + dto.getAmount(),
                dto.getDateTime().toString(),
                false
        );

        //Metodo para persistir a notificação no banco e enviar
        persistAndSend(notificationdto);
    }

    public void processNotification(TranferenceNotificationDto dto) {
        NotificationMessageDto notificationdto = new NotificationMessageDto(
                dto.getCustomerId(),
                "Transferência realizada",
                "Você transferiu R$" + dto.getAmount() +" para "+ dto.getCustomerToName(),
                dto.getDateTime().toString(),
                false
        );

        //Metodo para persistir a notificação no banco e enviar
        persistAndSend(notificationdto);
    }

    public void processNotification(WithdrawalNotificationDto dto) {
        NotificationMessageDto notificationdto = new NotificationMessageDto(
                dto.getCustomerId(),
                "Saque realizado em sua conta",
                "Saque de R$" + dto.getAmount() +" realizado em sua conta",
                dto.getDateTime().toString(),
                false
        );

        //Metodo para persistir a notificação no banco e enviar
        persistAndSend(notificationdto);
    }

    public void persistAndSend(NotificationMessageDto notificationdto) {
        //Persistir no banco
        NotificationModel notificationmodel = new NotificationModel(notificationdto);
        notificationRepository.save(notificationmodel);

        //Enviar
        sendNotificationToUser(notificationdto.getUserId(), notificationdto);
    }

    public void sendNotificationToUser(Long userId, NotificationMessageDto dto) {
        // Rota que o front deve se inscrever: /topic/notifications/{userId}
        messagingTemplate.convertAndSendToUser(
                userId.toString(),             // identifica o usuário
                "/queue/notification",       // destino que o usuário vai escutar
                dto                            // mensagem
        );
//        messagingTemplate.convertAndSend("/topic/notification/" + userId, dto);
    }

    public List<NotificationMessageDto> listAllByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId).stream()
                .map(NotificationMessageDto::fromEntity)
                .toList();
    }
}
