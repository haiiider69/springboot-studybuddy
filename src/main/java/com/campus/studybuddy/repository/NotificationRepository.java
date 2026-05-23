package com.campus.studybuddy.repository;

import com.campus.studybuddy.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByRecipientIdAndReadFalse(Long userId);
    long countByRecipientIdAndReadFalse(Long userId);
}