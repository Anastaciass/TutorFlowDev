package com.tutorflow.service;

import com.tutorflow.dto.RegisterRequestDTO;
import com.tutorflow.dto.TokenResponseDTO;
import com.tutorflow.model.RefreshToken;
import com.tutorflow.model.User;
import com.tutorflow.model.UserRole;
import com.tutorflow.repository.IUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.tutorflow.exception.AuthException;
import com.tutorflow.dto.LoginRequestDTO;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private IUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private IRefreshTokenService refreshTokenService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                passwordEncoder,
                jwtService,
                refreshTokenService
        );
    }

    @Test
    void register_shouldCreateUserAndReturnTokens() {
        // Arrange
        RegisterRequestDTO request = new RegisterRequestDTO(
                "Anna Petrova",
                "anna@example.com",
                "123456",
                "STUDENT"
        );

        User savedUser = new User();
        savedUser.setId(1);
        savedUser.setFullName("Anna Petrova");
        savedUser.setEmail("anna@example.com");
        savedUser.setPasswordHash("hashedPassword");
        savedUser.setRole(UserRole.STUDENT);
        savedUser.setCreatedAt(LocalDateTime.now());
        savedUser.setUpdatedAt(LocalDateTime.now());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setId(1);
        refreshToken.setToken("refresh-token-123");
        refreshToken.setUser(savedUser);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));

        when(userRepository.findByEmail("anna@example.com")).thenReturn(null);
        when(passwordEncoder.encode("123456")).thenReturn("hashedPassword");
        when(userRepository.save(ArgumentMatchers.any(User.class))).thenReturn(savedUser);
        when(jwtService.generateAccessToken(savedUser)).thenReturn("access-token-123");
        when(refreshTokenService.createRefreshToken(savedUser)).thenReturn(refreshToken);

        // Act
        TokenResponseDTO response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("access-token-123", response.getAccessToken());
        assertEquals("refresh-token-123", response.getRefreshToken());
        assertEquals(1, response.getUserId());
        assertEquals("anna@example.com", response.getEmail());
        assertEquals("STUDENT", response.getRole());
    }
    @Test
    void register_shouldThrowException_whenUserAlreadyExists() {
        // Arrange
        RegisterRequestDTO request = new RegisterRequestDTO(
                "Anna Petrova",
                "anna@example.com",
                "123456",
                "STUDENT"
        );

        User existingUser = new User();
        existingUser.setId(1);
        existingUser.setEmail("anna@example.com");

        when(userRepository.findByEmail("anna@example.com")).thenReturn(existingUser);

        // Act + Assert
        AuthException exception = org.junit.jupiter.api.Assertions.assertThrows(
                AuthException.class,
                () -> authService.register(request)
        );

        assertEquals("User with this email already exists", exception.getMessage());
    }
    @Test
    void login_shouldReturnTokens_whenCredentialsAreValid() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO(
                "anna@example.com",
                "123456"
        );

        User existingUser = new User();
        existingUser.setId(1);
        existingUser.setFullName("Anna Petrova");
        existingUser.setEmail("anna@example.com");
        existingUser.setPasswordHash("hashedPassword");
        existingUser.setRole(UserRole.STUDENT);
        existingUser.setCreatedAt(LocalDateTime.now());
        existingUser.setUpdatedAt(LocalDateTime.now());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setId(1);
        refreshToken.setToken("refresh-token-456");
        refreshToken.setUser(existingUser);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));

        when(userRepository.findByEmail("anna@example.com")).thenReturn(existingUser);
        when(passwordEncoder.matches("123456", "hashedPassword")).thenReturn(true);
        when(jwtService.generateAccessToken(existingUser)).thenReturn("access-token-456");
        when(refreshTokenService.createRefreshToken(existingUser)).thenReturn(refreshToken);

        // Act
        TokenResponseDTO response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("access-token-456", response.getAccessToken());
        assertEquals("refresh-token-456", response.getRefreshToken());
        assertEquals(1, response.getUserId());
        assertEquals("anna@example.com", response.getEmail());
        assertEquals("STUDENT", response.getRole());
    }
    @Test
    void login_shouldThrowException_whenUserNotFound() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO(
                "anna@example.com",
                "123456"
        );

        when(userRepository.findByEmail("anna@example.com")).thenReturn(null);

        // Act + Assert
        AuthException exception = assertThrows(
                AuthException.class,
                () -> authService.login(request)
        );

        assertEquals("User not found", exception.getMessage());
    }
    @Test
    void login_shouldThrowException_whenPasswordIsInvalid() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO(
                "anna@example.com",
                "123456"
        );

        User existingUser = new User();
        existingUser.setId(1);
        existingUser.setEmail("anna@example.com");
        existingUser.setPasswordHash("hashedPassword");

        when(userRepository.findByEmail("anna@example.com")).thenReturn(existingUser);
        when(passwordEncoder.matches("123456", "hashedPassword")).thenReturn(false);

        // Act + Assert
        AuthException exception = assertThrows(
                AuthException.class,
                () -> authService.login(request)
        );

        assertEquals("Invalid password", exception.getMessage());
    }
}