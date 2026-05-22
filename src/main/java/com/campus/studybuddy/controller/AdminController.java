package com.campus.studybuddy.controller;

import com.campus.studybuddy.dto.StatsResponse;
import com.campus.studybuddy.dto.StudyGroupResponse;
import com.campus.studybuddy.dto.StudyPostResponse;
import com.campus.studybuddy.dto.UserResponse;
import com.campus.studybuddy.service.AdminService;
import com.campus.studybuddy.service.StudyGroupService;
import com.campus.studybuddy.service.StudyPostService;
import com.campus.studybuddy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final StudyPostService studyPostService;
    private final StudyGroupService studyGroupService;

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/promote")
    public ResponseEntity<UserResponse> promoteToAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.promoteToAdmin(id));
    }

    @GetMapping("/posts")
    public ResponseEntity<List<StudyPostResponse>> getAllPosts() {
        return ResponseEntity.ok(studyPostService.getAllPosts());
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        adminService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/groups")
    public ResponseEntity<List<StudyGroupResponse>> getAllGroups() {
        return ResponseEntity.ok(studyGroupService.getAllGroups());
    }

    @DeleteMapping("/groups/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        adminService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }
}