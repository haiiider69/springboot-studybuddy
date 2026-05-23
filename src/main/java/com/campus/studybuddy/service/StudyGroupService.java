package com.campus.studybuddy.service;

import com.campus.studybuddy.dto.MemberResponse;
import com.campus.studybuddy.dto.StudyGroupRequest;
import com.campus.studybuddy.dto.StudyGroupResponse;
import com.campus.studybuddy.exception.ApiException;
import com.campus.studybuddy.model.StudyGroup;
import com.campus.studybuddy.model.StudyPost;
import com.campus.studybuddy.model.User;
import com.campus.studybuddy.repository.StudyGroupRepository;
import com.campus.studybuddy.repository.StudyPostRepository;
import com.campus.studybuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyGroupService {

    private final StudyPostRepository studyPostRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public StudyGroupResponse createGroup(StudyGroupRequest request) {
        StudyGroup group = new StudyGroup();
        group.setName(request.getName());
        group.setSubject(request.getSubject());
        return toResponse(studyGroupRepository.save(group));
    }

    public StudyGroupResponse addMember(Long groupId, Long userId) {
        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new ApiException("Group not found", HttpStatus.NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        if (!group.getMembers().contains(user)) {
            group.getMembers().add(user);
            studyGroupRepository.save(group);

            // Notify all existing members
            group.getMembers().forEach(member -> {
                if (!member.getId().equals(userId)) {
                    notificationService.createNotification(
                            member.getId(),
                            "👤 " + user.getUsername() + " joined " + group.getName()
                    );
                }
            });
        }

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
                .orElseThrow(() -> new ApiException("Group not found", HttpStatus.NOT_FOUND)));
    }

    public List<StudyGroupResponse> getGroupsByUser(Long userId) {
        return studyGroupRepository.findByMembersId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StudyGroupResponse createGroupFromPost(Long postId, Long userId) {
        StudyPost post = studyPostRepository.findById(postId)
                .orElseThrow(() -> new ApiException("Post not found", HttpStatus.NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        String groupName = "📚 " + post.getTitle();

        // Check if a group for this post already exists
        StudyGroup group = studyGroupRepository.findByName(groupName)
                .orElseGet(() -> {
                    StudyGroup newGroup = new StudyGroup();
                    newGroup.setName(groupName);
                    newGroup.setSubject(post.getCategory() != null ? post.getCategory().getName() : "General");
                    return studyGroupRepository.save(newGroup);
                });

        // Add user if not already a member
        if (!group.getMembers().contains(user)) {
            group.getMembers().add(user);
            studyGroupRepository.save(group);
        }

        return toResponse(group);
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
        res.setMembers(
                group.getMembers().stream()
                        .map(u -> {
                            MemberResponse m = new MemberResponse();
                            m.setId(u.getId());
                            m.setUsername(u.getUsername());
                            m.setProfilePicture(u.getProfilePicture());
                            return m;
                        })
                        .collect(Collectors.toList())
        );
        return res;
    }
}