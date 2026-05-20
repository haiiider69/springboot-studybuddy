package com.campus.studybuddy.service;

import com.campus.studybuddy.dto.RegisterRequest;
import com.campus.studybuddy.dto.UserResponse;
import com.campus.studybuddy.exception.ApiException;
import com.campus.studybuddy.model.User;
import com.campus.studybuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent())
            throw new ApiException("Email already in use", HttpStatus.CONFLICT);
        if (userRepository.findByUsername(request.getUsername()).isPresent())
            throw new ApiException("Username already taken", HttpStatus.CONFLICT);

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMajor(request.getMajor());
        user.setYear(request.getYear());

        return toResponse(userRepository.save(user));
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return toResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse toResponse(User user) {
        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setUsername(user.getUsername());
        res.setEmail(user.getEmail());
        res.setMajor(user.getMajor());
        res.setYear(user.getYear());
        return res;
    }

}