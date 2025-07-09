package com.cicarus.notification.controller;

import com.cicarus.notification.model.Notification;
import com.cicarus.notification.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Notification> getByCustomer(@RequestParam Long customerId) {
        return repository.findByCustomerId(customerId);
    }

    @GetMapping("/hello")
    public String helloEndpoint(){
        return "Hello from notification ms!";
    }
}
