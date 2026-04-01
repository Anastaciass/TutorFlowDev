package com.tutorflow.controller;

import com.tutorflow.dto.AuthResponseDTO;
import com.tutorflow.dto.LoginRequestDTO;
import com.tutorflow.dto.RegisterRequestDTO;
import com.tutorflow.service.IAuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final IAuthService authService;

    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponseDTO register(@RequestBody RegisterRequestDTO request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }
}