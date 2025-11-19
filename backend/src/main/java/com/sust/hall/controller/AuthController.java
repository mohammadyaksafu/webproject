package com.sust.hall.controller;

import com.sust.hall.dto.LoginRequest;
import com.sust.hall.dto.RegisterRequest;
import com.sust.hall.dto.Response;
import com.sust.hall.entity.User;
import com.sust.hall.enums.UserRole;
import com.sust.hall.service.UserService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j // Add CORS for React
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Response<?>> registerUser(@RequestBody RegisterRequest registerRequest) {
        log.info("/register was hit ");
        return ResponseEntity.ok(userService.registerUser(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<Response<?>> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.status(200).body(userService.login(loginRequest));
    }
}