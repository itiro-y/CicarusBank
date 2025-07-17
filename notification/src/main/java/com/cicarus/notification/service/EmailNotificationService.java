package com.cicarus.notification.service;

import com.cicarus.notification.dto.DepositNotificationDto;
import com.cicarus.notification.dto.EmailDto;
import com.cicarus.notification.dto.TranferenceNotificationDto;
import com.cicarus.notification.dto.WithdrawalNotificationDto;
import com.cicarus.notification.model.EmailModel;
import com.cicarus.notification.repository.EmailRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class EmailNotificationService {

    private final EmailBodyService emailBodyService;
    private final EmailRepository repository;
    private final NotificationSender sender;


    public EmailNotificationService(EmailBodyService emailBodyService, EmailRepository repository, NotificationSender sender) {
        this.emailBodyService = emailBodyService;
        this.repository = repository;
        this.sender = sender;
    }

    public void processNotification(DepositNotificationDto DepositNotificationDto) {
        DepositNotificationDto.setBody(emailBodyService.generateDepositBody(DepositNotificationDto));
        sendNotification(new EmailDto(DepositNotificationDto));
    }

    public void processNotification(TranferenceNotificationDto tranferenceNotificationDto) {
        tranferenceNotificationDto.setBody(emailBodyService.generateTranferenceBody(tranferenceNotificationDto));
        sendNotification(new EmailDto(tranferenceNotificationDto));
    }

    public void processNotification(WithdrawalNotificationDto withdrawalNotificationDto) {
        withdrawalNotificationDto.setBody(emailBodyService.generateWithdrawalBody(withdrawalNotificationDto));
        sendNotification(new EmailDto(withdrawalNotificationDto));
    }

    public void sendNotification(EmailDto event) {
        EmailModel emailModel = new EmailModel(
                event.getCustomerId(),
                event.getChannel(),
                event.getMessage(),
                event.getRecipientEmail(),
                Instant.now());

        repository.save(emailModel);
        sender.send(emailModel);
    }

    public EmailRepository getRepository() {
        return repository;
    }

    public NotificationSender getSender() {
        return sender;
    }


}
