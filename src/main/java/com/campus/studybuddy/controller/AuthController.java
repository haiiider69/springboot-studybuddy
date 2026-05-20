package com.campus.studybuddy.controller;

import com.campus.studybuddy.config.JwtService;
import com.campus.studybuddy.dto.LoginRequest;
import com.campus.studybuddy.exception.ApiException;
import com.campus.studybuddy.model.User;
import com.campus.studybuddy.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);

        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "userId", user.getId(),
                "username", user.getUsername()
        ));
    }
}