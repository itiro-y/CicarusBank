package com.cicarus.notification.controller;

import com.cicarus.notification.dto.NotificationEvent;
import com.cicarus.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Test Endpoint")
@RestController
@RequestMapping("/test")
public class TestController {

    private final NotificationService service;

    public TestController(NotificationService service) {
        this.service = service;
    }

    @Operation(summary = "Post that process a notification, receiving a event as parameter")
    @PostMapping("/send")
    public void sendTestEvent(@RequestBody NotificationEvent event) {
        service.processNotification(event);
    }
}
