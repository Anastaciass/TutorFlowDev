package com.tutorflow.service;

import com.tutorflow.dto.LoginRequestDTO;
import com.tutorflow.dto.RefreshTokenRequestDTO;
import com.tutorflow.dto.RegisterRequestDTO;
import com.tutorflow.dto.TokenResponseDTO;
import com.tutorflow.exception.AuthException;
import com.tutorflow.model.RefreshToken;
import com.tutorflow.model.User;
import com.tutorflow.model.UserRole;
import com.tutorflow.repository.IUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.tutorflow.dto.LogoutRequestDTO;

import java.time.LocalDateTime;

@Service
public class AuthService implements IAuthService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final IRefreshTokenService refreshTokenService;

    public AuthService(IUserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       IRefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public TokenResponseDTO register(RegisterRequestDTO request) {
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

        String accessToken = jwtService.generateAccessToken(savedUser);
        String refreshToken = refreshTokenService.createRefreshToken(savedUser).getToken();

        return new TokenResponseDTO(
                accessToken,
                refreshToken,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    @Override
    public TokenResponseDTO login(LoginRequestDTO request) {
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

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();

        return new TokenResponseDTO(
                accessToken,
                refreshToken,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Override
    public TokenResponseDTO refreshToken(RefreshTokenRequestDTO request) {
        RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken());
        refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();
        String accessToken = jwtService.generateAccessToken(user);

        return new TokenResponseDTO(
                accessToken,
                refreshToken.getToken(),
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }
    @Override
    public void logout(LogoutRequestDTO request) {
        RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken());
        User user = refreshToken.getUser();
        refreshTokenService.deleteByUser(user);
    }
}