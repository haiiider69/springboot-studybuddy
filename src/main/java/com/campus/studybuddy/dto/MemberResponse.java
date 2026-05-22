package com.campus.studybuddy.dto;

import lombok.Data;

@Data
public class MemberResponse {
    private Long id;
    private String username;
    private String profilePicture;
}