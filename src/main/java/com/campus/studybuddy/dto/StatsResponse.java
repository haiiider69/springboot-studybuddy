package com.campus.studybuddy.dto;

import lombok.Data;

@Data
public class StatsResponse {
    private long totalUsers;
    private long totalPosts;
    private long totalGroups;
    private long openPosts;
    private long closedPosts;
}