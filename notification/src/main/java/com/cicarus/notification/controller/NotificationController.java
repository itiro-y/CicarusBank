package com.cicarus.notification.controller;

import com.cicarus.notification.dto.NotificationMessageDto;
import com.cicarus.notification.model.EmailModel;
import com.cicarus.notification.repository.EmailRepository;
import com.cicarus.notification.service.WebSocketNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = " Notification Endpoint")
@RestController
@RequestMapping("/notification")
public class NotificationController {

    private final EmailRepository emailRepository;
    private final WebSocketNotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationController(EmailRepository repository, WebSocketNotificationService notificationService, SimpMessagingTemplate messagingTemplate) {
        this.emailRepository = repository;
        this.notificationService = notificationService;
        this.messagingTemplate = messagingTemplate;
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
