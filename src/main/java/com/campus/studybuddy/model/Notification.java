package com.campus.studybuddy.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String message;

    private boolean read = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User recipient;

    private LocalDateTime createdAt = LocalDateTime.now();
}