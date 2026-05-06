package com.tutorflow.controller;

import com.tutorflow.dto.*;
import com.tutorflow.service.IAuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.tutorflow.dto.MessageResponseDTO;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IAuthService authService;

    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public TokenResponseDTO register(@Valid @RequestBody RegisterRequestDTO request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public TokenResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public TokenResponseDTO refreshToken(@Valid @RequestBody RefreshTokenRequestDTO request) {
        return authService.refreshToken(request);
    }

    @PostMapping("/logout")
    public MessageResponseDTO logout(@Valid @RequestBody LogoutRequestDTO request) {
        return authService.logout(request);
    }
}
