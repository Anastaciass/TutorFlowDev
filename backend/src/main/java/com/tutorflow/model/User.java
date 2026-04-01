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
public class User {

    private Integer id;
    private String fullName;
    private String email;
    private String passwordHash;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}