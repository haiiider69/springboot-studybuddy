package com.campus.studybuddy.controller;

import com.campus.studybuddy.dto.StudySessionRequest;
import com.campus.studybuddy.dto.StudySessionResponse;
import com.campus.studybuddy.service.StudySessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class StudySessionController {

    private final StudySessionService studySessionService;

    @PostMapping
    public ResponseEntity<StudySessionResponse> createSession(@Valid @RequestBody StudySessionRequest request) {
        return ResponseEntity.ok(studySessionService.createSession(request));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<StudySessionResponse>> getSessionsByGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok(studySessionService.getSessionsByGroup(groupId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudySessionResponse>> getSessionsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(studySessionService.getSessionsByUser(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        studySessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}