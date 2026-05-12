package com.tutorflow.service;

import com.tutorflow.dto.CreateLessonSlotRequestDTO;
import com.tutorflow.dto.LessonSlotResponseDTO;
import com.tutorflow.model.LessonSlot;
import com.tutorflow.model.LessonSlotStatus;
import com.tutorflow.model.User;
import com.tutorflow.repository.ILessonSlotRepository;
import com.tutorflow.repository.IUserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LessonSlotService {

    private final ILessonSlotRepository lessonSlotRepository;
    private final IUserRepository userRepository;

    public LessonSlotService(
            ILessonSlotRepository lessonSlotRepository,
            IUserRepository userRepository
    ) {
        this.lessonSlotRepository = lessonSlotRepository;
        this.userRepository = userRepository;
    }

    public LessonSlotResponseDTO createSlot(
            CreateLessonSlotRequestDTO request,
            String tutorEmail
    ) {

        User tutor = userRepository.findByEmail(tutorEmail);

        LessonSlot lessonSlot = new LessonSlot();

        lessonSlot.setSubject(request.getSubject());
        lessonSlot.setDate(request.getDate());
        lessonSlot.setStartTime(request.getStartTime());
        lessonSlot.setEndTime(request.getEndTime());

        lessonSlot.setStatus(LessonSlotStatus.AVAILABLE);

        lessonSlot.setTutor(tutor);

        lessonSlot.setCreatedAt(LocalDateTime.now());
        lessonSlot.setUpdatedAt(LocalDateTime.now());

        LessonSlot savedSlot = lessonSlotRepository.save(lessonSlot);

        return mapToDTO(savedSlot);
    }

    public List<LessonSlotResponseDTO> getAvailableSlots() {

        List<LessonSlot> slots =
                lessonSlotRepository.findByStatus(LessonSlotStatus.AVAILABLE);

        return slots.stream()
                .map(this::mapToDTO)
                .toList();
    }

    private LessonSlotResponseDTO mapToDTO(LessonSlot slot) {

        return new LessonSlotResponseDTO(
                slot.getId(),
                slot.getSubject(),
                slot.getDate(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getStatus().name(),
                slot.getTutor().getId(),
                slot.getTutor().getFullName()
        );
    }
}