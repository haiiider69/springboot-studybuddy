package com.campus.studybuddy.service;

import com.campus.studybuddy.dto.StudyGroupRequest;
import com.campus.studybuddy.dto.StudyGroupResponse;
import com.campus.studybuddy.exception.ApiException;
import com.campus.studybuddy.model.StudyGroup;
import com.campus.studybuddy.model.User;
import com.campus.studybuddy.repository.StudyGroupRepository;
import com.campus.studybuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyGroupService {

    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;

    public StudyGroupResponse createGroup(StudyGroupRequest request) {
        StudyGroup group = new StudyGroup();
        group.setName(request.getName());
        group.setSubject(request.getSubject());
        return toResponse(studyGroupRepository.save(group));
    }

    public StudyGroupResponse addMember(Long groupId, Long userId) {
        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() ->  new ApiException("Group not found", HttpStatus.CONFLICT));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.CONFLICT));

        if (!group.getMembers().contains(user))
            group.getMembers().add(user);

        return toResponse(studyGroupRepository.save(group));
    }

    public List<StudyGroupResponse> getAllGroups() {
        return studyGroupRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StudyGroupResponse getGroupById(Long id) {
        return toResponse(studyGroupRepository.findById(id)
                .orElseThrow(() -> new ApiException("Group not found", HttpStatus.CONFLICT)));
    }

    public List<StudyGroupResponse> getGroupsByUser(Long userId) {
        return studyGroupRepository.findByMembersId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private StudyGroupResponse toResponse(StudyGroup group) {
        StudyGroupResponse res = new StudyGroupResponse();
        res.setId(group.getId());
        res.setName(group.getName());
        res.setSubject(group.getSubject());
        res.setMemberUsernames(
                group.getMembers().stream()
                        .map(User::getUsername)
                        .collect(Collectors.toList())
        );
        return res;
    }
}