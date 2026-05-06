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
public class Session {

    private Integer id;
    private String token;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;

    public Boolean isExpired() {
        if (expiresAt == null) {
            return true;
        }
        return LocalDateTime.now().isAfter(expiresAt);
    }
}