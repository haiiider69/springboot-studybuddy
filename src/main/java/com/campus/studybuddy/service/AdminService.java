package com.campus.studybuddy.service;

import com.campus.studybuddy.dto.StatsResponse;
import com.campus.studybuddy.dto.UserResponse;
import com.campus.studybuddy.exception.ApiException;
import com.campus.studybuddy.model.StudyPost;
import com.campus.studybuddy.repository.MessageRepository;
import com.campus.studybuddy.repository.StudyGroupRepository;
import com.campus.studybuddy.repository.StudyPostRepository;
import com.campus.studybuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final StudyPostRepository studyPostRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final MessageRepository messageRepository;
    private final UserService userService;

    public StatsResponse getStats() {
        StatsResponse stats = new StatsResponse();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalPosts(studyPostRepository.count());
        stats.setTotalGroups(studyGroupRepository.count());
        stats.setOpenPosts(studyPostRepository.findByStatus(StudyPost.Status.OPEN).size());
        stats.setClosedPosts(studyPostRepository.findByStatus(StudyPost.Status.CLOSED).size());
        return stats;
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id))
            throw new ApiException("User not found", HttpStatus.NOT_FOUND);
        userRepository.deleteById(id);
    }

    public void deletePost(Long id) {
        if (!studyPostRepository.existsById(id))
            throw new ApiException("Post not found", HttpStatus.NOT_FOUND);
        studyPostRepository.deleteById(id);
    }

    public void deleteGroup(Long id) {
        if (!studyGroupRepository.existsById(id))
            throw new ApiException("Group not found", HttpStatus.NOT_FOUND);
        studyGroupRepository.deleteById(id);
    }

    public UserResponse promoteToAdmin(Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        user.setRole("ADMIN");
        return userService.toResponse(userRepository.save(user));
    }
}