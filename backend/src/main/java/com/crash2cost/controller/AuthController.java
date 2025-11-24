package com.crash2cost.controller;

import com.crash2cost.dto.LoginRequest;
import com.crash2cost.dto.SignupRequest;
import com.crash2cost.dto.TokenResponse;
import com.crash2cost.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            TokenResponse response = authService.signup(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Signup error: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("Login attempt - username: {}, password length: {}",
                request.getUsername(), request.getPassword() != null ? request.getPassword().length() : 0);

        try {
            if (request.getUsername() == null || request.getUsername().isBlank()) {
                log.error("Username is null or blank");
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Username is required"));
            }
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                log.error("Password is null or blank");
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Password is required"));
            }

            TokenResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Incorrect username or password"));
        }
    }

    // Inner class for error responses
    private record ErrorResponse(String detail) {
    }
}
