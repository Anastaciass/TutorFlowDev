package com.tutorflow.service;

import com.tutorflow.model.RefreshToken;
import com.tutorflow.model.User;

public interface IRefreshTokenService {

    RefreshToken createRefreshToken(User user);

    RefreshToken verifyExpiration(RefreshToken token);

    RefreshToken findByToken(String token);

    void deleteByUser(User user);
}