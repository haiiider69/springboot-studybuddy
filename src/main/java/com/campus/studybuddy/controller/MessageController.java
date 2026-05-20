package com.campus.studybuddy.controller;

import com.campus.studybuddy.dto.MessageRequest;
import com.campus.studybuddy.dto.MessageResponse;
import com.campus.studybuddy.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/{groupId}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long groupId,
            @Valid @RequestBody MessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(groupId, request));
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<MessageResponse>> getGroupMessages(@PathVariable Long groupId) {
        return ResponseEntity.ok(messageService.getGroupMessages(groupId));
    }
}