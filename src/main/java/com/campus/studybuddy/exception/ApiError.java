package com.campus.studybuddy.exception;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApiError {
    private int status;
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
    }
}