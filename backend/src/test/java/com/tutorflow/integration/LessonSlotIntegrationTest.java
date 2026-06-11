package com.tutorflow.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LessonSlotIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String PASSWORD = "Password123!";

    @Test
    void tutorCanCreateLessonSlot() throws Exception {
        String tutorEmail = "tutor-" + UUID.randomUUID() + "@test.com";

        registerUser("Tutor Test", tutorEmail, PASSWORD, "TUTOR");

        String tutorToken = loginAndGetAccessToken(tutorEmail, PASSWORD);

        String subject = "Integration Test Slot " + UUID.randomUUID();

        String createSlotJson = """
                {
                  "subject": "%s",
                  "date": "%s",
                  "startTime": "18:00",
                  "endTime": "19:00"
                }
                """.formatted(subject, LocalDate.now().plusDays(10));

        var result = mockMvc.perform(post("/api/tutor/slots")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + tutorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createSlotJson))
                .andDo(print())
                .andReturn();

        int status = result.getResponse().getStatus();
        String body = result.getResponse().getContentAsString();

        assertThat(status)
                .as("Create lesson slot failed. Response body: " + body)
                .isBetween(200, 299);

        assertThat(body).contains(subject);
    }

    private void registerUser(String fullName, String email, String password, String role) throws Exception {
        String registerJson = """
                {
                  "fullName": "%s",
                  "email": "%s",
                  "password": "%s",
                  "role": "%s"
                }
                """.formatted(fullName, email, password, role);

        var result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andDo(print())
                .andReturn();

        int status = result.getResponse().getStatus();
        String body = result.getResponse().getContentAsString();

        assertThat(status)
                .as("Register failed. Response body: " + body)
                .isBetween(200, 299);
    }

    private String loginAndGetAccessToken(String email, String password) throws Exception {
        String loginJson = """
                {
                  "email": "%s",
                  "password": "%s"
                }
                """.formatted(email, password);

        var result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andDo(print())
                .andReturn();

        int status = result.getResponse().getStatus();
        String body = result.getResponse().getContentAsString();

        assertThat(status)
                .as("Login failed. Response body: " + body)
                .isEqualTo(200);

        String accessToken = extractJsonString(body, "accessToken");

        assertThat(accessToken).isNotBlank();

        return accessToken;
    }

    private String extractJsonString(String json, String fieldName) {
        String pattern = "\"" + fieldName + "\":\"";
        int start = json.indexOf(pattern);

        if (start == -1) {
            throw new IllegalStateException("Field '" + fieldName + "' was not found in response: " + json);
        }

        start += pattern.length();
        int end = json.indexOf("\"", start);

        if (end == -1) {
            throw new IllegalStateException("Could not extract field '" + fieldName + "' from response: " + json);
        }

        return json.substring(start, end);
    }
    @Test
    void studentCanBookAvailableLessonSlot() throws Exception {
        String tutorEmail = "tutor-" + UUID.randomUUID() + "@test.com";
        String studentEmail = "student-" + UUID.randomUUID() + "@test.com";

        registerUser("Tutor Test", tutorEmail, PASSWORD, "TUTOR");
        registerUser("Student Test", studentEmail, PASSWORD, "STUDENT");

        String tutorToken = loginAndGetAccessToken(tutorEmail, PASSWORD);
        String studentToken = loginAndGetAccessToken(studentEmail, PASSWORD);

        String subject = "Integration Booking Slot " + UUID.randomUUID();

        String createSlotJson = """
            {
              "subject": "%s",
              "date": "%s",
              "startTime": "18:00",
              "endTime": "19:00"
            }
            """.formatted(subject, LocalDate.now().plusDays(10));

        var createResult = mockMvc.perform(post("/api/tutor/slots")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + tutorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createSlotJson))
                .andDo(print())
                .andReturn();

        String createBody = createResult.getResponse().getContentAsString();

        assertThat(createResult.getResponse().getStatus())
                .as("Create lesson slot failed. Response body: " + createBody)
                .isBetween(200, 299);

        Integer slotId = Integer.valueOf(extractJsonNumber(createBody, "id"));

        var bookResult = mockMvc.perform(post("/api/student/slots/" + slotId + "/book")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andDo(print())
                .andReturn();

        int bookStatus = bookResult.getResponse().getStatus();
        String bookBody = bookResult.getResponse().getContentAsString();

        assertThat(bookStatus)
                .as("Book slot failed. Response body: " + bookBody)
                .isBetween(200, 299);

        assertThat(bookBody).contains(subject);
    }
    private String extractJsonNumber(String json, String fieldName) {
        String pattern = "\"" + fieldName + "\":";
        int start = json.indexOf(pattern);

        if (start == -1) {
            throw new IllegalStateException("Field '" + fieldName + "' was not found in response: " + json);
        }

        start += pattern.length();

        int end = start;
        while (end < json.length() && Character.isDigit(json.charAt(end))) {
            end++;
        }

        if (end == start) {
            throw new IllegalStateException("Could not extract numeric field '" + fieldName + "' from response: " + json);
        }

        return json.substring(start, end);
    }
    @Test
    void tutorCanConfirmBooking() throws Exception {
        String tutorEmail = "tutor-" + UUID.randomUUID() + "@test.com";
        String studentEmail = "student-" + UUID.randomUUID() + "@test.com";

        registerUser("Tutor Test", tutorEmail, PASSWORD, "TUTOR");
        registerUser("Student Test", studentEmail, PASSWORD, "STUDENT");

        String tutorToken = loginAndGetAccessToken(tutorEmail, PASSWORD);
        String studentToken = loginAndGetAccessToken(studentEmail, PASSWORD);

        String subject = "Integration Confirm Slot " + UUID.randomUUID();

        Integer slotId = createSlotAndReturnId(tutorToken, subject);

        mockMvc.perform(post("/api/student/slots/" + slotId + "/book")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andDo(print())
                .andReturn();

        var confirmResult = mockMvc.perform(post("/api/tutor/slots/" + slotId + "/confirm")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + tutorToken))
                .andDo(print())
                .andReturn();

        int confirmStatus = confirmResult.getResponse().getStatus();
        String confirmBody = confirmResult.getResponse().getContentAsString();

        assertThat(confirmStatus)
                .as("Confirm booking failed. Response body: " + confirmBody)
                .isBetween(200, 299);

        assertThat(confirmBody).contains(subject);
    }
    @Test
    void tutorCanDeclineBooking() throws Exception {
        String tutorEmail = "tutor-" + UUID.randomUUID() + "@test.com";
        String studentEmail = "student-" + UUID.randomUUID() + "@test.com";

        registerUser("Tutor Test", tutorEmail, PASSWORD, "TUTOR");
        registerUser("Student Test", studentEmail, PASSWORD, "STUDENT");

        String tutorToken = loginAndGetAccessToken(tutorEmail, PASSWORD);
        String studentToken = loginAndGetAccessToken(studentEmail, PASSWORD);

        String subject = "Integration Decline Slot " + UUID.randomUUID();

        Integer slotId = createSlotAndReturnId(tutorToken, subject);

        mockMvc.perform(post("/api/student/slots/" + slotId + "/book")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andDo(print())
                .andReturn();

        var declineResult = mockMvc.perform(post("/api/tutor/slots/" + slotId + "/decline")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + tutorToken))
                .andDo(print())
                .andReturn();

        int declineStatus = declineResult.getResponse().getStatus();
        String declineBody = declineResult.getResponse().getContentAsString();

        assertThat(declineStatus)
                .as("Decline booking failed. Response body: " + declineBody)
                .isBetween(200, 299);

        assertThat(declineBody).contains(subject);
    }
    private Integer createSlotAndReturnId(String tutorToken, String subject) throws Exception {
        String createSlotJson = """
            {
              "subject": "%s",
              "date": "%s",
              "startTime": "18:00",
              "endTime": "19:00"
            }
            """.formatted(subject, LocalDate.now().plusDays(10));

        var createResult = mockMvc.perform(post("/api/tutor/slots")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + tutorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createSlotJson))
                .andDo(print())
                .andReturn();

        String createBody = createResult.getResponse().getContentAsString();

        assertThat(createResult.getResponse().getStatus())
                .as("Create lesson slot failed. Response body: " + createBody)
                .isBetween(200, 299);

        return Integer.valueOf(extractJsonNumber(createBody, "id"));
    }
}
