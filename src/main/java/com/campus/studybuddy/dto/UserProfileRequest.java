package com.campus.studybuddy.dto;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String bio;
    private String profilePicture;
    private String major;
    private String studyYear;
}