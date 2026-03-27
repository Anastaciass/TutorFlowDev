package com.tutorflow.model;
import java.time.LocalDateTime;

public class Session {
    private Integer id;
    private String token;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;

    public Session() {
    }

    public Session(Integer id, String token, LocalDateTime expiresAt, LocalDateTime createdAt) {
        this.id = id;
        this.token = token;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean isExpired() {
        if (expiresAt == null) {
            return true;
        }
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
