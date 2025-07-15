package com.cicarus.notification.controller;

import com.cicarus.notification.dto.NotificationMessageDto;
import com.cicarus.notification.model.EmailModel;
import com.cicarus.notification.repository.EmailRepository;
import com.cicarus.notification.service.WebSocketNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = " Notification Endpoint")
@RestController
@RequestMapping("/notification")
public class NotificationController {

    private final EmailRepository emailRepository;
    private final WebSocketNotificationService notificationService;

    public NotificationController(EmailRepository repository, WebSocketNotificationService notificationService) {
        this.emailRepository = repository;
        this.notificationService = notificationService;
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

    @GetMapping("/ws/{userId}")
    public ResponseEntity<List<NotificationMessageDto>> getAllByUser(@PathVariable Long userId) {
        List<NotificationMessageDto> notifications = notificationService.listAllByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/ping")
    public String ping(){
        return "Pong!";
    }
}
