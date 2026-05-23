package com.campus.studybuddy.service;

import com.campus.studybuddy.dto.StudySessionRequest;
import com.campus.studybuddy.dto.StudySessionResponse;
import com.campus.studybuddy.exception.ApiException;
import com.campus.studybuddy.model.StudyGroup;
import com.campus.studybuddy.model.StudySession;
import com.campus.studybuddy.model.User;
import com.campus.studybuddy.repository.StudyGroupRepository;
import com.campus.studybuddy.repository.StudySessionRepository;
import com.campus.studybuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudySessionService {

    private final StudySessionRepository studySessionRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;

    public StudySessionResponse createSession(StudySessionRequest request) {
        StudyGroup group = studyGroupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ApiException("Group not found", HttpStatus.NOT_FOUND));
        User organizer = userRepository.findById(request.getOrganizerId())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        StudySession session = new StudySession();
        session.setTitle(request.getTitle());
        session.setDescription(request.getDescription());
        session.setDateTime(request.getDateTime());
        session.setLocation(request.getLocation());
        session.setGroup(group);
        session.setOrganizer(organizer);

        return toResponse(studySessionRepository.save(session));
    }

    public List<StudySessionResponse> getSessionsByGroup(Long groupId) {
        return studySessionRepository.findByGroupIdOrderByDateTimeAsc(groupId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<StudySessionResponse> getSessionsByUser(Long userId) {
        return studySessionRepository.findByOrganizerIdOrderByDateTimeAsc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteSession(Long id) {
        if (!studySessionRepository.existsById(id))
            throw new ApiException("Session not found", HttpStatus.NOT_FOUND);
        studySessionRepository.deleteById(id);
    }

    private StudySessionResponse toResponse(StudySession session) {
        StudySessionResponse res = new StudySessionResponse();
        res.setId(session.getId());
        res.setTitle(session.getTitle());
        res.setDescription(session.getDescription());
        res.setDateTime(session.getDateTime());
        res.setLocation(session.getLocation());
        res.setGroupName(session.getGroup().getName());
        res.setGroupId(session.getGroup().getId());
        res.setOrganizerUsername(session.getOrganizer().getUsername());
        res.setCreatedAt(session.getCreatedAt());
        return res;
    }
}