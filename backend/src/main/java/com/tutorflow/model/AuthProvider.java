package com.tutorflow.model;
import java.time.LocalDateTime;

public class AuthProvider {
    private Integer id;
    private AuthProviderType provider;
    private String providerUserId;
    private LocalDateTime createdAt;

    public AuthProvider() {
    }

    public AuthProvider(Integer id, AuthProviderType provider, String providerUserId, LocalDateTime createdAt) {
        this.id = id;
        this.provider = provider;
        this.providerUserId = providerUserId;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public AuthProviderType getProvider() {
        return provider;
    }

    public String getProviderUserId() {
        return providerUserId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setProvider(AuthProviderType provider) {
        this.provider = provider;
    }

    public void setProviderUserId(String providerUserId) {
        this.providerUserId = providerUserId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
