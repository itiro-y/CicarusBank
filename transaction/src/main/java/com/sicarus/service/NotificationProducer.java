package com.sicarus.service;

import com.sicarus.clients.CustomerClient;
import com.sicarus.dto.*;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class NotificationProducer {
    private static final String TOPIC = "transaction-topic";
    private final CustomerClient customerClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private String mensagemDeposito;

    public NotificationProducer(KafkaTemplate<String, Object> kafkaTemplate, CustomerClient customerClient) {
        this.kafkaTemplate = kafkaTemplate;
        this.customerClient = customerClient;
    }

    public NotificationDto send(NotificationDto message) {
        kafkaTemplate.send(TOPIC, message);
        return message;
    }

    public DepositNotificationDto send(DepositNotificationDto message) {
        kafkaTemplate.send(TOPIC, message);
        return message;
    }

    //Metodo que incluirá no objeto DepositNotificationDto os dados do customer e chamará o envio para a fila kafka
    public DepositNotificationDto sendNotification(DepositNotificationDto depositNotificationDto) {
        CustomerDto customerDto = customerClient.getCustomerById(depositNotificationDto.getCustomerId());

        depositNotificationDto.setChannel("EMAIL");
        depositNotificationDto.setCustomerName(customerDto.getName());
        depositNotificationDto.setRecipientEmail(customerDto.getEmail());
        depositNotificationDto.setDateTime(Instant.now());

        return send(depositNotificationDto);
    }



    //Metodo para teste
    public NotificationDto getNotification() {
        NotificationDto notificationDto = new NotificationDto();



        notificationDto.setCustomerId(1L);
        notificationDto.setChannel("EMAIL");
        notificationDto.setBody("Testandooooooooooooooooooooo");
        notificationDto.setRecipientEmail("kevin37614250@hotmail.com");

        return notificationDto;
    }


}
