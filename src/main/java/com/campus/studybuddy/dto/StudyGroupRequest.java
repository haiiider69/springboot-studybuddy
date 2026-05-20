package com.campus.studybuddy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudyGroupRequest {

    @NotBlank(message = "Group name is required")
    private String name;

    private String subject;
}