package com.crash2cost.service;

import com.crash2cost.dto.LoginRequest;
import com.crash2cost.dto.SignupRequest;
import com.crash2cost.dto.TokenResponse;
import com.crash2cost.model.User;
import com.crash2cost.repository.UserRepository;
import com.crash2cost.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public TokenResponse signup(SignupRequest request) {
        log.debug("🔵 DEBUG: Signup request received - username: {}, email: {}", 
                request.getUsername(), request.getEmail());

        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            log.error("❌ DEBUG: Username already exists: {}", request.getUsername());
            throw new RuntimeException("Username already exists");
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            log.error("❌ DEBUG: Email already exists: {}", request.getEmail());
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("user")
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        log.info("✅ DEBUG: User created successfully - {}", user.getUsername());

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return TokenResponse.builder()
                .access_token(token)
                .token_type("bearer")
                .role(user.getRole())
                .username(user.getUsername())
                .build();
    }

    public TokenResponse login(LoginRequest request) {
        log.debug("🔵 DEBUG: Login request received - username: {}", request.getUsername());

        try {
            // Check if user exists first
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> {
                        log.error("❌ DEBUG: User not found in database: {}", request.getUsername());
                        return new RuntimeException("User not found");
                    });
            
            log.info("✅ DEBUG: User found in database - {}, role: {}", user.getUsername(), user.getRole());

            // Validate password manually instead of using AuthenticationManager
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                log.error("❌ DEBUG: Password does not match for user: {}", request.getUsername());
                throw new RuntimeException("Incorrect password");
            }

            log.info("✅ DEBUG: Password validated successfully - {}", request.getUsername());

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

            return TokenResponse.builder()
                    .access_token(token)
                    .token_type("bearer")
                    .role(user.getRole())
                    .username(user.getUsername())
                    .build();

        } catch (Exception e) {
            log.error("❌ DEBUG: Authentication failed for {}: {} - {}", 
                request.getUsername(), e.getClass().getSimpleName(), e.getMessage());
            throw new RuntimeException("Incorrect username or password");
        }
    }
}
