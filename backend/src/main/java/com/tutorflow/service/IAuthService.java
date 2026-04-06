package com.tutorflow.service;

import com.tutorflow.dto.LoginRequestDTO;
import com.tutorflow.dto.RefreshTokenRequestDTO;
import com.tutorflow.dto.RegisterRequestDTO;
import com.tutorflow.dto.TokenResponseDTO;
import com.tutorflow.dto.LogoutRequestDTO;
import com.tutorflow.dto.MessageResponseDTO;

public interface IAuthService {

    TokenResponseDTO register(RegisterRequestDTO request);

    TokenResponseDTO login(LoginRequestDTO request);

    TokenResponseDTO refreshToken(RefreshTokenRequestDTO request);
    MessageResponseDTO logout(LogoutRequestDTO request);
}