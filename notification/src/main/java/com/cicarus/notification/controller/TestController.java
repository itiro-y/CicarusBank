//package com.cicarus.notification.controller;
//
//import com.cicarus.notification.dto.EmailDto;
//import com.cicarus.notification.service.EmailNotificationService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import org.springframework.web.bind.annotation.*;
//
//@Tag(name = "Test Endpoint")
//@RestController
//@RequestMapping("/test")
//public class TestController {
//
//    private final EmailNotificationService service;
//
//    public TestController(EmailNotificationService service) {
//        this.service = service;
//    }
//
//    @Operation(summary = "Post that process a notification, receiving a event as parameter")
//    @PostMapping("/send")
//    public void sendTestEvent(@RequestBody EmailDto event) {
//        service.processNotification(event);
//    }
//}
