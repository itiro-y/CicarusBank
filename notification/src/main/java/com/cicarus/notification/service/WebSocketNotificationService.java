package com.cicarus.notification.service;

import com.cicarus.notification.dto.DepositNotificationDto;
import com.cicarus.notification.dto.NotificationMessageDto;
import com.cicarus.notification.dto.TranferenceNotificationDto;
import com.cicarus.notification.dto.WithdrawalNotificationDto;
import com.cicarus.notification.model.NotificationModel;
import com.cicarus.notification.repository.NotificationRepository;
import org.apache.kafka.common.errors.ResourceNotFoundException;
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
                dto.getCustomerName()+", você recebeu um depósito de R$" + dto.getAmount() +" em sua conta.",
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
                dto.getCustomerName()+", você transferiu R$" + dto.getAmount() +" para "+ dto.getCustomerToName() +".",
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
                "Saque de R$" + dto.getAmount() +" realizado em sua conta.",
                dto.getDateTime().toString(),
                false
        );

        //Metodo para persistir a notificação no banco e enviar
        persistAndSend(notificationdto);
    }

    public void persistAndSend(NotificationMessageDto notificationdto) {
        //Persistir no banco
        NotificationModel notificationmodel = new NotificationModel(notificationdto);

        System.out.println("Persistando novo notification e atribuindo ao novo dto \n");
        notificationRepository.save(notificationmodel);

        notificationdto.setId(notificationmodel.getId());

        //Enviar
        System.out.printf("A partir daqui, vai chamar o metodo que vai enviar a notificação via websocket. notificationDto: %s\n", notificationdto.toString());
        sendNotificationToUser(notificationdto.getUserId(), notificationdto);
    }

    public void sendNotificationToUser(Long userId, NotificationMessageDto dto) {

        System.out.println("Enviando notificação para usuário ID {"+userId+"} no destino /queue/notifications\n");
        // Rota que o front deve se inscrever: /topic/notifications/{userId}
        messagingTemplate.convertAndSendToUser(
                String.valueOf(dto.getUserId()),             // identifica o usuário
                "/queue/notifications",       // destino que o usuário vai escutar
                dto                            // mensagem
        );
    }

    public List<NotificationMessageDto> listAllByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId).stream()
                .map(NotificationMessageDto::fromEntity)
                .toList();
    }

    public boolean readNotification(Long notificationId) {
        NotificationModel notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notificação não encontrada com id: " + notificationId));

        notification.setRead(true);
        notificationRepository.save(notification);

        return true;
    }
}
