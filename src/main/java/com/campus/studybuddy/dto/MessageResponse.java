package com.campus.studybuddy.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageResponse {
    private Long id;
    private String content;
    private String senderUsername;
    private LocalDateTime sentAt;
}