package com.tutorflow.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BookingFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void studentCanRegisterAndLogin() throws Exception {
        String uniqueEmail = "student-" + UUID.randomUUID() + "@test.com";

        String registerJson = """
        {
          "fullName": "Student Test",
          "email": "%s",
          "password": "Password123!",
          "role": "STUDENT"
        }
        """.formatted(uniqueEmail);

        var registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andDo(print())
                .andReturn();

        int registerStatus = registerResult.getResponse().getStatus();
        String registerBody = registerResult.getResponse().getContentAsString();

        assertThat(registerStatus)
                .as("Register failed. Response body: " + registerBody)
                .isBetween(200, 299);

        String loginJson = """
            {
              "email": "%s",
              "password": "Password123!"
            }
            """.formatted(uniqueEmail);

        var loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andDo(print())
                .andReturn();

        int loginStatus = loginResult.getResponse().getStatus();
        String loginBody = loginResult.getResponse().getContentAsString();

        assertThat(loginStatus)
                .as("Login failed. Response body: " + loginBody)
                .isEqualTo(200);

        assertThat(loginBody).contains("accessToken");
        assertThat(loginBody).contains("refreshToken");
    }
}