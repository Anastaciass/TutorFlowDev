package com.tutorflow.controller;

import com.tutorflow.dto.CreateLessonSlotRequestDTO;
import com.tutorflow.dto.LessonSlotResponseDTO;
import com.tutorflow.service.LessonSlotService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LessonSlotController {

    private final LessonSlotService lessonSlotService;

    public LessonSlotController(LessonSlotService lessonSlotService) {
        this.lessonSlotService = lessonSlotService;
    }

    @PostMapping("/tutor/slots")
    public LessonSlotResponseDTO createSlot(
            @Valid @RequestBody CreateLessonSlotRequestDTO request,
            Authentication authentication
    ) {
        String tutorEmail = authentication.getName();
        return lessonSlotService.createSlot(request, tutorEmail);
    }

    @GetMapping("/student/slots")
    public List<LessonSlotResponseDTO> getAvailableSlots() {
        return lessonSlotService.getAvailableSlots();
    }
}