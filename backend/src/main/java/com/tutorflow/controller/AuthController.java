package com.tutorflow.controller;

import com.tutorflow.dto.LoginRequestDTO;
import com.tutorflow.dto.RefreshTokenRequestDTO;
import com.tutorflow.dto.RegisterRequestDTO;
import com.tutorflow.dto.TokenResponseDTO;
import com.tutorflow.service.IAuthService;
import org.springframework.web.bind.annotation.*;
import com.tutorflow.dto.LogoutRequestDTO;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final IAuthService authService;

    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public TokenResponseDTO register(@RequestBody RegisterRequestDTO request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public TokenResponseDTO login(@RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public TokenResponseDTO refreshToken(@RequestBody RefreshTokenRequestDTO request) {
        return authService.refreshToken(request);
    }
    
    @PostMapping("/logout")
    public void logout(@RequestBody LogoutRequestDTO request) {
        authService.logout(request);
    }
}
