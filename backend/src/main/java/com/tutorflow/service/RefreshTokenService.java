package com.tutorflow.service;

import com.tutorflow.exception.AuthException;
import com.tutorflow.model.RefreshToken;
import com.tutorflow.model.User;
import com.tutorflow.repository.IRefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RefreshTokenService implements IRefreshTokenService {

    private final IRefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(IRefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    public RefreshToken createRefreshToken(User user) {
        RefreshToken existingToken = refreshTokenRepository.findByUser(user);

        if (existingToken != null) {
            refreshTokenRepository.delete(existingToken);
        }

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new AuthException("Refresh token has expired. Please log in again.");
        }

        return token;
    }

    @Override
    public RefreshToken findByToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token);

        if (refreshToken == null) {
            throw new AuthException("Refresh token not found.");
        }

        return refreshToken;
    }

    @Override
    public void deleteByUser(User user) {
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user);

        if (refreshToken != null) {
            refreshTokenRepository.delete(refreshToken);
        }
    }
}