package com.cicarus.notification.controller;

import com.cicarus.notification.dto.NotificationEvent;
import com.cicarus.notification.service.NotificationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    private final NotificationService service;

    public TestController(NotificationService service) {
        this.service = service;
    }

    @PostMapping("/send")
    public void sendTestEvent(@RequestBody NotificationEvent event) {
        service.processNotification(event);
    }
}
