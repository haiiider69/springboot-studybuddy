package com.campus.studybuddy.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudySessionResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private String location;
    private String groupName;
    private Long groupId;
    private String organizerUsername;
    private LocalDateTime createdAt;
}