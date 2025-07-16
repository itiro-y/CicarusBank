package com.sicarus.account.service;

import com.sicarus.account.clients.CustomerClient;
import com.sicarus.account.dto.*;
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


    //Metodo que incluirá no objeto DepositNotificationDto os dados do customer e chamará o envio para a fila kafka
    public DepositNotificationDto sendNotification(DepositNotificationDto depositNotificationDto) {
        System.out.println("Chegou no sendNotification do deposito.");
        CustomerDto customerDto = customerClient.getCustomerById(depositNotificationDto.getCustomerId());

        depositNotificationDto.setChannel("EMAIL");
        depositNotificationDto.setCustomerName(customerDto.getName());
        depositNotificationDto.setRecipientEmail(customerDto.getEmail());
        depositNotificationDto.setDateTime(Instant.now());

        System.out.println("depositNotificationDto depois do outro processamento: " + depositNotificationDto.toString());

        kafkaTemplate.send(TOPIC, depositNotificationDto);
        return depositNotificationDto;
    }

    //Metodo para terminar de pegar os dados para posterior montagem do email.
    //Após isso, chamará o metodo de envio para a fila kafka
    public TranferenceNotificationDto sendNotification(TranferenceNotificationDto tranferenceNotificationDto) {
        CustomerDto customerDto = customerClient.getCustomerById(tranferenceNotificationDto.getCustomerId());
        CustomerDto customerToDto = customerClient.getCustomerById(tranferenceNotificationDto.getCustomerToId());

        System.out.println("Objeto customerToDto: " + customerToDto.toString());

        tranferenceNotificationDto.setChannel("EMAIL");
        tranferenceNotificationDto.setCustomerName(customerDto.getName());
        tranferenceNotificationDto.setRecipientEmail(customerDto.getEmail());
        tranferenceNotificationDto.setCustomerToName(customerToDto.getName());
        //Pegar posteriormente o e-mail do destinatario
        tranferenceNotificationDto.setDateTime(Instant.now());

        //Criar um DepositNotificationDto para enviar mensagem também para quem está recebendo a transferência
        DepositNotificationDto depositNotificationDto = new DepositNotificationDto(
                "deposit",
                tranferenceNotificationDto.getCustomerToId(),
                tranferenceNotificationDto.getCustomerToName(),
                customerToDto.getEmail(),
                "EMAIL",
                tranferenceNotificationDto.getAmount(),
                tranferenceNotificationDto.getDateTime(),
                ""
        );
        System.out.println("Objeto depositNotificationDto: " + depositNotificationDto.toString());
        sendNotification(depositNotificationDto);

        kafkaTemplate.send(TOPIC, tranferenceNotificationDto);
        return tranferenceNotificationDto;
    }


    //Metodo que incluirá no objeto WithdrawalNotificationDto os dados do customer e chamará o envio para a fila kafka
    public WithdrawalNotificationDto sendNotification(WithdrawalNotificationDto wnd) {
        CustomerDto customerDto = customerClient.getCustomerById(wnd.getCustomerId());

        wnd.setChannel("EMAIL");
        wnd.setCustomerName(customerDto.getName());
        wnd.setRecipientEmail(customerDto.getEmail());
        wnd.setDateTime(Instant.now());

        kafkaTemplate.send(TOPIC, wnd);
        return wnd;
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
