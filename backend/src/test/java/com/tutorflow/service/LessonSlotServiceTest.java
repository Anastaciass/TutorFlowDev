package com.tutorflow.service;

import com.tutorflow.dto.CreateLessonSlotRequestDTO;
import com.tutorflow.dto.LessonSlotResponseDTO;
import com.tutorflow.model.LessonSlot;
import com.tutorflow.model.LessonSlotStatus;
import com.tutorflow.model.User;
import com.tutorflow.repository.ILessonSlotRepository;
import com.tutorflow.repository.IUserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LessonSlotServiceTest {

    @Mock
    private ILessonSlotRepository lessonSlotRepository;

    @Mock
    private IUserRepository userRepository;

    @InjectMocks
    private LessonSlotService lessonSlotService;

    @Test
    void createSlot_shouldCreateAvailableLessonSlotForTutor() {

        // Arrange
        User tutor = new User();
        tutor.setId(1);
        tutor.setFullName("Sarah Johnson");
        tutor.setEmail("sarah@gmail.com");

        CreateLessonSlotRequestDTO request = new CreateLessonSlotRequestDTO();

        ReflectionTestUtils.setField(request, "subject", "Mathematics");
        ReflectionTestUtils.setField(request, "date", LocalDate.now().plusDays(7));
        ReflectionTestUtils.setField(request, "startTime", LocalTime.of(14, 0));
        ReflectionTestUtils.setField(request, "endTime", LocalTime.of(15, 0));

        when(userRepository.findByEmail("sarah@gmail.com"))
                .thenReturn(tutor);

        when(lessonSlotRepository.save(any(LessonSlot.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        lessonSlotService.createSlot(request, "sarah@gmail.com");

        // Assert
        ArgumentCaptor<LessonSlot> slotCaptor =
                ArgumentCaptor.forClass(LessonSlot.class);

        verify(lessonSlotRepository, times(1))
                .save(slotCaptor.capture());

        LessonSlot savedSlot = slotCaptor.getValue();

        assertEquals("Mathematics", savedSlot.getSubject());
        assertEquals(LocalDate.now().plusDays(7), savedSlot.getDate());
        assertEquals(LocalTime.of(14, 0), savedSlot.getStartTime());
        assertEquals(LocalTime.of(15, 0), savedSlot.getEndTime());
        assertEquals(LessonSlotStatus.AVAILABLE, savedSlot.getStatus());
        assertEquals(tutor, savedSlot.getTutor());
    }

    @Test
    void getTutorSlots_shouldReturnSlotsCreatedByTutor() {

        // Arrange
        User tutor = new User();
        tutor.setId(1);
        tutor.setFullName("Sarah Johnson");
        tutor.setEmail("sarah@gmail.com");

        LessonSlot slot = new LessonSlot();
        slot.setId(1);
        slot.setSubject("English");
        slot.setDate(LocalDate.of(2026, 5, 21));
        slot.setStartTime(LocalTime.of(13, 30));
        slot.setEndTime(LocalTime.of(14, 30));
        slot.setStatus(LessonSlotStatus.AVAILABLE);
        slot.setTutor(tutor);

        when(userRepository.findByEmail("sarah@gmail.com"))
                .thenReturn(tutor);

        when(lessonSlotRepository.findByTutor(tutor))
                .thenReturn(List.of(slot));

        // Act
        List<LessonSlotResponseDTO> result =
                lessonSlotService.getTutorSlots("sarah@gmail.com");

        // Assert
        assertEquals(1, result.size());
        assertEquals("English", result.get(0).getSubject());
        assertEquals("Sarah Johnson", result.get(0).getTutorName());
        assertEquals("AVAILABLE", result.get(0).getStatus());
    }

    @Test
    void getAvailableSlots_shouldReturnOnlyAvailableSlots() {

        // Arrange
        User tutor = new User();
        tutor.setId(1);
        tutor.setFullName("Sarah Johnson");

        LessonSlot slot = new LessonSlot();
        slot.setId(1);
        slot.setSubject("Mathematics");
        slot.setDate(LocalDate.of(2026, 5, 22));
        slot.setStartTime(LocalTime.of(10, 0));
        slot.setEndTime(LocalTime.of(11, 0));
        slot.setStatus(LessonSlotStatus.AVAILABLE);
        slot.setTutor(tutor);

        when(lessonSlotRepository.findByStatus(LessonSlotStatus.AVAILABLE))
                .thenReturn(List.of(slot));

        // Act
        List<LessonSlotResponseDTO> result =
                lessonSlotService.getAvailableSlots();

        // Assert
        assertEquals(1, result.size());
        assertEquals("Mathematics", result.get(0).getSubject());
        assertEquals("AVAILABLE", result.get(0).getStatus());
        assertEquals("Sarah Johnson", result.get(0).getTutorName());
    }
    @Test
    void confirmBooking_shouldChangeStatusFromPendingToConfirmed() {
        // Arrange
        User tutor = new User();
        tutor.setId(1);
        tutor.setFullName("Anastacia");
        tutor.setEmail("tutor@gmail.com");

        User student = new User();
        student.setId(2);
        student.setFullName("John");
        student.setEmail("student@gmail.com");

        LessonSlot slot = new LessonSlot();
        slot.setId(1);
        slot.setSubject("Math");
        slot.setDate(LocalDate.now().plusDays(3));
        slot.setStartTime(LocalTime.of(14, 0));
        slot.setEndTime(LocalTime.of(15, 0));
        slot.setStatus(LessonSlotStatus.PENDING);
        slot.setTutor(tutor);
        slot.setStudent(student);

        when(lessonSlotRepository.findById(1)).thenReturn(Optional.of(slot));
        when(lessonSlotRepository.save(any(LessonSlot.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        LessonSlotResponseDTO result = lessonSlotService.confirmBooking(1, "tutor@gmail.com");

        // Assert
        assertEquals("CONFIRMED", result.getStatus());
        assertEquals("Math", result.getSubject());

        ArgumentCaptor<LessonSlot> slotCaptor = ArgumentCaptor.forClass(LessonSlot.class);
        verify(lessonSlotRepository).save(slotCaptor.capture());

        LessonSlot savedSlot = slotCaptor.getValue();
        assertEquals(LessonSlotStatus.CONFIRMED, savedSlot.getStatus());
        assertEquals(student, savedSlot.getStudent());
    }
    @Test
    void declineBooking_shouldChangeStatusToAvailableAndRemoveStudent() {
        // Arrange
        User tutor = new User();
        tutor.setId(1);
        tutor.setFullName("Anastacia");
        tutor.setEmail("tutor@gmail.com");

        User student = new User();
        student.setId(2);
        student.setFullName("John");
        student.setEmail("student@gmail.com");

        LessonSlot slot = new LessonSlot();
        slot.setId(1);
        slot.setSubject("English");
        slot.setDate(LocalDate.now().plusDays(4));
        slot.setStartTime(LocalTime.of(10, 0));
        slot.setEndTime(LocalTime.of(11, 0));
        slot.setStatus(LessonSlotStatus.PENDING);
        slot.setTutor(tutor);
        slot.setStudent(student);

        when(lessonSlotRepository.findById(1)).thenReturn(Optional.of(slot));
        when(lessonSlotRepository.save(any(LessonSlot.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        LessonSlotResponseDTO result = lessonSlotService.declineBooking(1, "tutor@gmail.com");

        // Assert
        assertEquals("AVAILABLE", result.getStatus());
        assertEquals("English", result.getSubject());

        ArgumentCaptor<LessonSlot> slotCaptor = ArgumentCaptor.forClass(LessonSlot.class);
        verify(lessonSlotRepository).save(slotCaptor.capture());

        LessonSlot savedSlot = slotCaptor.getValue();
        assertEquals(LessonSlotStatus.AVAILABLE, savedSlot.getStatus());
        assertEquals(null, savedSlot.getStudent());
    }
    @Test
    void getStudentBookings_shouldReturnBookingsForStudent() {
        // Arrange
        User student = new User();
        student.setId(2);
        student.setFullName("John");
        student.setEmail("student@gmail.com");

        User tutor = new User();
        tutor.setId(1);
        tutor.setFullName("Anastacia");
        tutor.setEmail("tutor@gmail.com");

        LessonSlot slot = new LessonSlot();
        slot.setId(1);
        slot.setSubject("Estonian Language");
        slot.setDate(LocalDate.now().plusDays(5));
        slot.setStartTime(LocalTime.of(12, 0));
        slot.setEndTime(LocalTime.of(13, 0));
        slot.setStatus(LessonSlotStatus.CONFIRMED);
        slot.setTutor(tutor);
        slot.setStudent(student);

        when(userRepository.findByEmail("student@gmail.com")).thenReturn(student);
        when(lessonSlotRepository.findByStudent(student)).thenReturn(List.of(slot));

        // Act
        List<LessonSlotResponseDTO> result =
                lessonSlotService.getStudentBookings("student@gmail.com");

        // Assert
        assertEquals(1, result.size());
        assertEquals("Estonian Language", result.get(0).getSubject());
        assertEquals("CONFIRMED", result.get(0).getStatus());
        assertEquals("Anastacia", result.get(0).getTutorName());
    }
}