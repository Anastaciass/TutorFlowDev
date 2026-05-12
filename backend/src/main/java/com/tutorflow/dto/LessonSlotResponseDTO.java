package com.tutorflow.dto;
import java.time.LocalDate;
import java.time.LocalTime;

public class LessonSlotResponseDTO {

        private Integer id;

        private String subject;

        private LocalDate date;

        private LocalTime startTime;

        private LocalTime endTime;

        private String status;

        private Integer tutorId;

        private String tutorName;

        public LessonSlotResponseDTO(
                Integer id,
                String subject,
                LocalDate date,
                LocalTime startTime,
                LocalTime endTime,
                String status,
                Integer tutorId,
                String tutorName
        ) {
            this.id = id;
            this.subject = subject;
            this.date = date;
            this.startTime = startTime;
            this.endTime = endTime;
            this.status = status;
            this.tutorId = tutorId;
            this.tutorName = tutorName;
        }

        public Integer getId() {
            return id;
        }

        public String getSubject() {
            return subject;
        }

        public LocalDate getDate() {
            return date;
        }

        public LocalTime getStartTime() {
            return startTime;
        }

        public LocalTime getEndTime() {
            return endTime;
        }

        public String getStatus() {
            return status;
        }

        public Integer getTutorId() {
            return tutorId;
        }

        public String getTutorName() {
            return tutorName;
        }
    }

