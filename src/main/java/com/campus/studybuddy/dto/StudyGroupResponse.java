package com.campus.studybuddy.dto;

import lombok.Data;
import java.util.List;

@Data
public class StudyGroupResponse {
    private Long id;
    private String name;
    private String subject;
    private List<String> memberUsernames;
}