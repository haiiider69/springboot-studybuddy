package com.campus.studybuddy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageRequest {

    @NotBlank(message = "Message content is required")
    private String content;

    private Long senderId;
}