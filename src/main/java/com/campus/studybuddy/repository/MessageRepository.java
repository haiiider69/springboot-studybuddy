package com.campus.studybuddy.repository;

import com.campus.studybuddy.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByGroupIdOrderBySentAtAsc(Long groupId);
}