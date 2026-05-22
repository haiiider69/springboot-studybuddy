package com.campus.studybuddy.controller;

import com.campus.studybuddy.dto.StudyGroupRequest;
import com.campus.studybuddy.dto.StudyGroupResponse;
import com.campus.studybuddy.service.StudyGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class StudyGroupController {

    private final StudyGroupService studyGroupService;

    @PostMapping
    public ResponseEntity<StudyGroupResponse> createGroup(@Valid @RequestBody StudyGroupRequest request) {
        return ResponseEntity.ok(studyGroupService.createGroup(request));
    }

    @GetMapping
    public ResponseEntity<List<StudyGroupResponse>> getAllGroups() {
        return ResponseEntity.ok(studyGroupService.getAllGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyGroupResponse> getGroupById(@PathVariable Long id) {
        return ResponseEntity.ok(studyGroupService.getGroupById(id));
    }

    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<StudyGroupResponse> addMember(
            @PathVariable Long groupId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(studyGroupService.addMember(groupId, userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudyGroupResponse>> getGroupsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(studyGroupService.getGroupsByUser(userId));
    }
    @PostMapping("/from-post/{postId}/user/{userId}")
    public ResponseEntity<StudyGroupResponse> createGroupFromPost(
            @PathVariable Long postId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(studyGroupService.createGroupFromPost(postId, userId));
    }
}