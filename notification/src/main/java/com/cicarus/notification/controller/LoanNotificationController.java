package com.cicarus.notification.controller;

import com.cicarus.notification.client.LoanClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notification/loan-status")
public class LoanNotificationController {

    private final LoanClient loanClient;

    @Autowired
    public LoanNotificationController(LoanClient loanClient) {
        this.loanClient = loanClient;
    }

    @GetMapping("/{id}")
    public Object getLoanStatus(@PathVariable("id") Long id) {
        return loanClient.getLoanStatusById(id);
    }
}

