package com.sicarus.account.controller;

import com.sicarus.account.dto.AuthRequest;
import com.sicarus.account.dto.AuthResponse;
import com.sicarus.account.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth Endpoint")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "Post that allows for login. It receives a AuthRequest as RequestBody")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get that returns pong. It is for testing purposes")
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
