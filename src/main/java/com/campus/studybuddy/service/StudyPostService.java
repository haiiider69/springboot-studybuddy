package com.campus.studybuddy.service;

import com.campus.studybuddy.dto.StudyPostRequest;
import com.campus.studybuddy.dto.StudyPostResponse;
import com.campus.studybuddy.exception.ApiException;
import com.campus.studybuddy.model.Category;
import com.campus.studybuddy.model.StudyPost;
import com.campus.studybuddy.model.User;
import com.campus.studybuddy.repository.CategoryRepository;
import com.campus.studybuddy.repository.StudyPostRepository;
import com.campus.studybuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.campus.studybuddy.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyPostService {

    private final StudyPostRepository studyPostRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final NotificationService notificationService;


    public StudyPostResponse createPost(StudyPostRequest request) {
        User author = userRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.CONFLICT));

        StudyPost post = new StudyPost();
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setAuthor(author);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ApiException("Category not found", HttpStatus.CONFLICT));
            post.setCategory(category);
        }
// Notify all users about new post
        userRepository.findAll().forEach(u -> {
            if (!u.getId().equals(request.getAuthorId())) {
                notificationService.createNotification(
                        u.getId(),
                        "📚 " + author.getUsername() + " posted: " + post.getTitle()
                );
            }
        });
        return toResponse(studyPostRepository.save(post));
    }

    public List<StudyPostResponse> getAllPosts() {
        return studyPostRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<StudyPostResponse> getOpenPosts() {
        return studyPostRepository.findByStatus(StudyPost.Status.OPEN)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StudyPostResponse getPostById(Long id) {
        return toResponse(studyPostRepository.findById(id)
                .orElseThrow(() -> new ApiException("Category not found", HttpStatus.CONFLICT)));
    }

    public StudyPostResponse closePost(Long id) {
        StudyPost post = studyPostRepository.findById(id)
                .orElseThrow(() -> new ApiException("Post not found", HttpStatus.CONFLICT));
        post.setStatus(StudyPost.Status.CLOSED);
        return toResponse(studyPostRepository.save(post));
    }

    public void deletePost(Long id) {
        studyPostRepository.deleteById(id);
    }

    private StudyPostResponse toResponse(StudyPost post) {
        StudyPostResponse res = new StudyPostResponse();
        res.setId(post.getId());
        res.setTitle(post.getTitle());
        res.setDescription(post.getDescription());
        res.setStatus(post.getStatus().name());
        res.setAuthorUsername(post.getAuthor().getUsername());
        res.setCategoryName(post.getCategory() != null ? post.getCategory().getName() : null);
        res.setCreatedAt(post.getCreatedAt());
        return res;
    }
}