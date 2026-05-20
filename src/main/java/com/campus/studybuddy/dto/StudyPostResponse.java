package com.campus.studybuddy.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudyPostResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String authorUsername;
    private String categoryName;
    private LocalDateTime createdAt;
}