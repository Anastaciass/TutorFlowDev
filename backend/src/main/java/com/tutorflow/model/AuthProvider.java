package com.tutorflow.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthProvider {

    private Integer id;
    private AuthProviderType provider;
    private String providerUserId;
    private LocalDateTime createdAt;
}