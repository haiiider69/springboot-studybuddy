package com.campus.studybuddy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiRequest {

    @NotBlank(message = "Topic is required")
    private String topic;

    private String context;
}