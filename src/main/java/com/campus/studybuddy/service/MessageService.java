package com.campus.studybuddy.service;

import com.campus.studybuddy.dto.MessageRequest;
import com.campus.studybuddy.dto.MessageResponse;
import com.campus.studybuddy.exception.ApiException;
import com.campus.studybuddy.model.Message;
import com.campus.studybuddy.model.StudyGroup;
import com.campus.studybuddy.model.User;
import com.campus.studybuddy.repository.MessageRepository;
import com.campus.studybuddy.repository.StudyGroupRepository;
import com.campus.studybuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final StudyGroupRepository studyGroupRepository;

    public MessageResponse sendMessage(Long groupId, MessageRequest request) {
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.CONFLICT));
        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new ApiException("Group not found", HttpStatus.CONFLICT));

        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(sender);
        message.setGroup(group);

        return toResponse(messageRepository.save(message));
    }

    public List<MessageResponse> getGroupMessages(Long groupId) {
        return messageRepository.findByGroupIdOrderBySentAtAsc(groupId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private MessageResponse toResponse(Message message) {
        MessageResponse res = new MessageResponse();
        res.setId(message.getId());
        res.setContent(message.getContent());
        res.setSenderUsername(message.getSender().getUsername());
        res.setSentAt(message.getSentAt());
        return res;
    }
}