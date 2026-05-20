package com.campus.studybuddy.controller;

import com.campus.studybuddy.dto.StudyPostRequest;
import com.campus.studybuddy.dto.StudyPostResponse;
import com.campus.studybuddy.service.StudyPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class StudyPostController {

    private final StudyPostService studyPostService;

    @PostMapping
    public ResponseEntity<StudyPostResponse> createPost(@Valid @RequestBody StudyPostRequest request) {
        return ResponseEntity.ok(studyPostService.createPost(request));
    }

    @GetMapping
    public ResponseEntity<List<StudyPostResponse>> getAllPosts() {
        return ResponseEntity.ok(studyPostService.getAllPosts());
    }

    @GetMapping("/open")
    public ResponseEntity<List<StudyPostResponse>> getOpenPosts() {
        return ResponseEntity.ok(studyPostService.getOpenPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyPostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(studyPostService.getPostById(id));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<StudyPostResponse> closePost(@PathVariable Long id) {
        return ResponseEntity.ok(studyPostService.closePost(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        studyPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}