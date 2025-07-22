package com.cicarus.notification.controller;

import com.cicarus.notification.client.CustomerClient;
import com.cicarus.notification.dto.EmailDto;
import com.cicarus.notification.dto.NotificationMessageDto;
import com.cicarus.notification.model.EmailModel;
import com.cicarus.notification.repository.EmailRepository;
import com.cicarus.notification.service.EmailNotificationService;
import com.cicarus.notification.service.WebSocketNotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = " Notification Endpoint")
@RestController
@RequestMapping("/notification")
public class NotificationController {

    private final EmailRepository emailRepository;
    private final WebSocketNotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailNotificationService emailNotificationService;
    private final CustomerClient customerClient; // Cliente Feign para buscar dados do usuário
    private final ObjectMapper objectMapper = new ObjectMapper(); // Utilitário para conversão de objetos

    public NotificationController(EmailRepository repository,
                                  WebSocketNotificationService notificationService,
                                  SimpMessagingTemplate messagingTemplate,
                                  EmailNotificationService emailNotificationService,
                                  CustomerClient customerClient) { // Adicionado CustomerClient
        this.emailRepository = repository;
        this.notificationService = notificationService;
        this.messagingTemplate = messagingTemplate;
        this.emailNotificationService = emailNotificationService;
        this.customerClient = customerClient; // Injetado
    }

    @Operation(summary = "Get that returns a customer by its ID")
    @GetMapping("/email")
    public List<EmailModel> getByCustomer(@RequestParam Long customerId) {
        return emailRepository.findByCustomerId(customerId);
    }

    @Operation(summary = "Get that returs a hello notification. For testing purposes")
    @GetMapping("/hello")
    public String helloEndpoint(){
        return "Hello from notification ms!";
    }

    @GetMapping("/websocket/{userId}")
    public ResponseEntity<List<NotificationMessageDto>> getAllByUser(@PathVariable Long userId) {
        List<NotificationMessageDto> notifications = notificationService.listAllByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/send/{userId}")
    public void sendNotification(@PathVariable Long userId, @RequestBody NotificationMessageDto dto) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                dto
        );
    }

    /**
     * Endpoint atualizado para enviar e-mail buscando o destinatário pelo ID.
     * @param userId O ID do usuário para quem o e-mail será enviado.
     * @param requestBodyDto O corpo da requisição contendo a mensagem e o canal.
     * @return ResponseEntity indicando o sucesso ou falha da operação.
     */
    @Operation(summary = "Envia um e-mail para um usuário específico buscando o e-mail pelo seu ID")
    @PostMapping("/email/send/{userId}")
    public ResponseEntity<Void> sendEmailToUser(@PathVariable Long userId, @RequestBody EmailDto requestBodyDto) {
        try {
            // 1. Busca os dados do cliente (incluindo e-mail) a partir do microsserviço de cliente
            Object customerData = customerClient.getCustomerById(userId);
            if (customerData == null) {
                System.err.println("Cliente não encontrado com ID: " + userId);
                return ResponseEntity.notFound().build();
            }

            // 2. Extrai o e-mail do objeto retornado pelo Feign client
            Map<String, Object> customerMap = objectMapper.convertValue(customerData, Map.class);
            String recipientEmail = (String) customerMap.get("email");

            if (recipientEmail == null || recipientEmail.isEmpty()) {
                System.err.println("E-mail não encontrado para o cliente com ID: " + userId);
                return ResponseEntity.badRequest().body(null); // Retorna erro se o e-mail não for encontrado
            }

            // 3. Monta o DTO final para o serviço de notificação com os dados corretos
            EmailDto finalEmailDto = new EmailDto(
                    userId,
                    requestBodyDto.getChannel(), // Usa o canal do corpo da requisição
                    requestBodyDto.getMessage(), // Usa a mensagem do corpo da requisição
                    recipientEmail               // Usa o e-mail buscado
            );

            // 4. Envia a notificação por e-mail
            emailNotificationService.sendNotification(finalEmailDto);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            System.err.println("Falha ao buscar cliente ou enviar e-mail: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("{notificationId}/read")
    public ResponseEntity readNotification(@PathVariable Long notificationId) {
        notificationService.readNotification(notificationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ping")
    public String ping(){
        return "Pong!";
    }
}
