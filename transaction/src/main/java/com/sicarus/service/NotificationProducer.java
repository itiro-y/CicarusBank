package com.sicarus.service;

import com.sicarus.clients.CustomerClient;
import com.sicarus.dto.AccountDTO;
import com.sicarus.dto.CustomerDto;
import com.sicarus.dto.NotificationDto;
import com.sicarus.dto.TransactionRequestDTO;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class NotificationProducer {
    private static final String TOPIC = "transaction-topic";
    private final CustomerClient customerClient;
    private final KafkaTemplate<String, NotificationDto> kafkaTemplate;

    private String mensagemDeposito = """
                                    Olá, %s!
                                    
                                    Recebemos um depósito em sua conta bancária. A operação foi concluída com sucesso.
                                    
                                    📄 Detalhes do depósito:
                                    • Valor: R$ %.2f
                                    • Data do depósito: %s
                                    
                                    O valor já está disponível para utilização em sua conta.
                                    
                                    Caso não tenha realizado esse depósito ou identifique qualquer irregularidade, entre em contato com nossa central de atendimento.
                                    """;

    public NotificationProducer(KafkaTemplate<String, NotificationDto> kafkaTemplate,  CustomerClient customerClient) {
        this.kafkaTemplate = kafkaTemplate;
        this.customerClient = customerClient;
    }

    public NotificationDto send(NotificationDto message) {
        kafkaTemplate.send(TOPIC, message);
        return message;
    }

    public NotificationDto sendDepositNotification(AccountDTO account, TransactionRequestDTO transactionRequestDTO) {
        CustomerDto customerDto = customerClient.getCustomerById(account.getUserId());

        String corpoEmail = String.format(
                mensagemDeposito,
                customerDto.getName(),
                transactionRequestDTO.getAmount(),
                Instant.now()
        );

        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setCustomerId(customerDto.getId());
        notificationDto.setChannel("EMAIL");
        notificationDto.setMessage(corpoEmail);
        notificationDto.setRecipientEmail(customerDto.getEmail());

        return send(notificationDto);
    }



    //Metodo para teste
    public NotificationDto getNotification() {
        NotificationDto notificationDto = new NotificationDto();



        notificationDto.setCustomerId(1L);
        notificationDto.setChannel("EMAIL");
        notificationDto.setMessage("Testandooooooooooooooooooooo");
        notificationDto.setRecipientEmail("kevin37614250@hotmail.com");

        return notificationDto;
    }


}
