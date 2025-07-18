package com.sicarus.controller;

import com.sicarus.dto.AuthRequest;
import com.sicarus.dto.AuthResponse;
import com.sicarus.dto.UserCreateRequest;
import com.sicarus.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Operation(summary = "Creates a new user")
    @PostMapping("/create")
    public ResponseEntity<Void> createUser(@RequestBody UserCreateRequest request) {
        authService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Get that returns pong. It is for testing purposes")
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
