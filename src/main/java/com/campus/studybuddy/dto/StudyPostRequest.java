package com.campus.studybuddy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudyPostRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private Long categoryId;
    private Long authorId;
}