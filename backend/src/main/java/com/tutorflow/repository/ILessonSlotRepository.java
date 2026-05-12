package com.tutorflow.repository;

import com.tutorflow.model.LessonSlot;
import com.tutorflow.model.LessonSlotStatus;
import com.tutorflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ILessonSlotRepository extends JpaRepository<LessonSlot, Integer> {

    List<LessonSlot> findByStatus(LessonSlotStatus status);

    List<LessonSlot> findByTutor(User tutor);
}