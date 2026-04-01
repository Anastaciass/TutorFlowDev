package com.tutorflow.service;

import com.tutorflow.dto.AuthResponseDTO;
import com.tutorflow.dto.LoginRequestDTO;
import com.tutorflow.dto.RegisterRequestDTO;
import com.tutorflow.model.User;
import com.tutorflow.model.UserRole;
import com.tutorflow.repository.IUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.tutorflow.exception.AuthException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService implements IAuthService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(IUserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponseDTO register(RegisterRequestDTO request) {
        User existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser != null) {
            throw new AuthException("User with this email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.valueOf(request.getRole().toUpperCase()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        String token = UUID.randomUUID().toString();

        return new AuthResponseDTO(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            throw new AuthException("User not found");
        }

        Boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        );

        if (!passwordMatches) {
            throw new AuthException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponseDTO(
                token,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}