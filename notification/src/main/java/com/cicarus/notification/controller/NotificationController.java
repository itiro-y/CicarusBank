package com.cicarus.notification.controller;

import com.cicarus.notification.model.Notification;
import com.cicarus.notification.repository.NotificationRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = " Notification Endpoint")
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @Operation(summary = "Get that returns a customer by its ID")
    @GetMapping
    public List<Notification> getByCustomer(@RequestParam Long customerId) {
        return repository.findByCustomerId(customerId);
    }

    @Operation(summary = "Get that returs a hello notification. For testing purposes")
    @GetMapping("/hello")
    public String helloEndpoint(){
        return "Hello from notification ms!";
    }
}
