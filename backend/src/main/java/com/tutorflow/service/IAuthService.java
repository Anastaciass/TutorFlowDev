package com.tutorflow.service;

import com.tutorflow.dto.AuthResponseDTO;
import com.tutorflow.dto.LoginRequestDTO;
import com.tutorflow.dto.RegisterRequestDTO;

public interface IAuthService {

    AuthResponseDTO register(RegisterRequestDTO request);

    AuthResponseDTO login(LoginRequestDTO request);
}
