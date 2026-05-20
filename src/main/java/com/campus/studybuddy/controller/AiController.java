package com.campus.studybuddy.controller;

import com.campus.studybuddy.dto.AiRequest;
import com.campus.studybuddy.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/explain")
    public ResponseEntity<?> explain(@Valid @RequestBody AiRequest request) {
        String result = aiService.explainTopic(request.getTopic(), request.getContext());
        return ResponseEntity.ok(Map.of("explanation", result));
    }

    @PostMapping("/quiz")
    public ResponseEntity<?> quiz(@Valid @RequestBody AiRequest request) {
        String content = request.getContext() != null && !request.getContext().isBlank()
                ? request.getContext()
                : request.getTopic();
        String result = aiService.generateQuiz(content);
        return ResponseEntity.ok(Map.of("quiz", result));
    }

    @PostMapping("/summarize")
    public ResponseEntity<?> summarize(@RequestBody AiRequest request) {
        String result = aiService.summarizeNotes(request.getContext());
        return ResponseEntity.ok(Map.of("summary", result));
    }
}