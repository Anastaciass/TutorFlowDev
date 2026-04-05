package com.tutorflow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class RoleTestController {

    @GetMapping("/student")
    public String studentEndpoint() {
        return "Hello, STUDENT!";
    }

    @GetMapping("/tutor")
    public String tutorEndpoint() {
        return "Hello, TUTOR!";
    }

    @GetMapping("/common")
    public String commonEndpoint() {
        return "Hello, authenticated user!";
    }
}