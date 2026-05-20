package com.campus.studybuddy.repository;

import com.campus.studybuddy.model.StudyPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudyPostRepository extends JpaRepository<StudyPost, Long> {
    List<StudyPost> findByStatus(StudyPost.Status status);
    List<StudyPost> findByAuthorId(Long authorId);
    List<StudyPost> findByCategoryId(Long categoryId);
}