package com.campus.studybuddy.dto;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String major;
    private String year;
}