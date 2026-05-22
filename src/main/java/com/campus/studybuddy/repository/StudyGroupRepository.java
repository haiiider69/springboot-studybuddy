package com.campus.studybuddy.repository;

import com.campus.studybuddy.model.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    List<StudyGroup> findByMembersId(Long userId);
    List<StudyGroup> findBySubjectContainingIgnoreCase(String subject);

    Optional<StudyGroup> findByName(String name);
}