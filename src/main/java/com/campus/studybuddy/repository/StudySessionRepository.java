package com.campus.studybuddy.repository;

import com.campus.studybuddy.model.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByGroupIdOrderByDateTimeAsc(Long groupId);
    List<StudySession> findByOrganizerIdOrderByDateTimeAsc(Long organizerId);
}