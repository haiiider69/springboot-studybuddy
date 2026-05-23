package com.campus.studybuddy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudySessionRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Date and time is required")
    private LocalDateTime dateTime;

    private String location;

    @NotNull(message = "Group is required")
    private Long groupId;

    @NotNull(message = "Organizer is required")
    private Long organizerId;
}