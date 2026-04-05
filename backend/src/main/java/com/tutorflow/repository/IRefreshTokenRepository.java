package com.tutorflow.repository;

import com.tutorflow.model.RefreshToken;
import com.tutorflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {

    RefreshToken findByToken(String token);

    RefreshToken findByUser(User user);
}