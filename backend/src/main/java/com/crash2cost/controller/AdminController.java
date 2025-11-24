package com.crash2cost.controller;

import com.crash2cost.model.User;
import com.crash2cost.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/fix-passwords")
    public ResponseEntity<?> fixPasswords() {
        log.info("Fixing user passwords to Spring BCrypt format...");

        List<User> allUsers = userRepository.findAll();
        int fixed = 0;

        for (User user : allUsers) {
            String currentPassword = user.getPassword();

            // Check if password is not in Spring BCrypt format ($2a$ or $2b$)
            if (!currentPassword.startsWith("$2a$") && !currentPassword.startsWith("$2b$")) {
                log.info("Fixing password for user: {}", user.getUsername());

                // For existing users, we need to reset their password
                // Since we can't decrypt the old hash, set a default password
                String defaultPassword = user.getRole().equals("admin") ? "admin123" : "password123";
                user.setPassword(passwordEncoder.encode(defaultPassword));
                userRepository.save(user);
                fixed++;

                log.info("Password fixed for: {} (default: {})", user.getUsername(), defaultPassword);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Password migration completed");
        response.put("usersFixed", fixed);
        response.put("totalUsers", allUsers.size());
        response.put("note", "Users with old passwords have been reset to default passwords");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reset-users")
    public ResponseEntity<?> resetUsers() {
        log.warn("DELETING ALL USERS...");

        // Delete ALL users
        userRepository.deleteAll();
        log.info("All users deleted");

        // Create fresh admin user
        User admin = User.builder()
                .username("admin")
                .email("admin@crash2cost.com")
                .password(passwordEncoder.encode("admin123"))
                .role("admin")
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(admin);
        log.info("Admin user created: admin/admin123");

        Map<String, String> response = new HashMap<>();
        response.put("message", "ALL users deleted and admin recreated");
        response.put("admin_username", "admin");
        response.put("admin_password", "admin123");
        response.put("note", "All users must sign up again");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {
        log.info("Creating admin user manually...");

        // Check if admin already exists
        if (userRepository.existsByUsername("admin")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Admin user already exists"));
        }

        // Create admin user
        User admin = User.builder()
                .username("admin")
                .email("admin@crash2cost.com")
                .password(passwordEncoder.encode("admin123"))
                .role("admin")
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(admin);
        log.info("Admin user created: admin/admin123");

        return ResponseEntity.ok(Map.of(
                "message", "Admin user created successfully",
                "username", "admin",
                "password", "admin123"));
    }

    @PostMapping("/fix-admin-password")
    public ResponseEntity<?> fixAdminPassword() {
        log.info("Fixing admin password...");

        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Admin user does not exist"));
        }

        // Update password with proper Java BCrypt encoding
        admin.setPassword(passwordEncoder.encode("admin123"));
        userRepository.save(admin);
        log.info("Admin password updated: admin/admin123");

        return ResponseEntity.ok(Map.of(
                "message", "Admin password fixed successfully",
                "username", "admin",
                "password", "admin123",
                "passwordHash", admin.getPassword().substring(0, 20) + "..."));
    }

    @GetMapping("/debug-admin")
    public ResponseEntity<?> debugAdmin() {
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            return ResponseEntity.ok(Map.of("error", "Admin user not found"));
        }

        String testPassword = "admin123";
        boolean matches = passwordEncoder.matches(testPassword, admin.getPassword());

        return ResponseEntity.ok(Map.of(
                "username", admin.getUsername(),
                "email", admin.getEmail(),
                "role", admin.getRole(),
                "passwordHash", admin.getPassword().substring(0, Math.min(30, admin.getPassword().length())),
                "passwordHashFull", admin.getPassword(),
                "testPassword", testPassword,
                "passwordMatches", matches,
                "hashStartsWith2a", admin.getPassword().startsWith("$2a$"),
                "hashStartsWith2b", admin.getPassword().startsWith("$2b$")));
    }

    @PostMapping("/test-login")
    public ResponseEntity<?> testLogin(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        log.info("TEST LOGIN: username={}", username);

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "error", "User not found in database"));
        }

        log.info("User found: {}, role={}", user.getUsername(), user.getRole());
        log.info("Password hash: {}", user.getPassword());

        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        log.info("Password matches: {}", passwordMatches);

        return ResponseEntity.ok(Map.of(
                "success", passwordMatches,
                "userFound", true,
                "username", user.getUsername(),
                "role", user.getRole(),
                "passwordMatches", passwordMatches,
                "providedPassword", password,
                "hashPrefix", user.getPassword().substring(0, 10)));
    }

    @GetMapping("/users")
    public ResponseEntity<?> listUsers() {
        List<User> users = userRepository.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("total", users.size());
        response.put("users", users.stream().map(u -> {
            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("username", u.getUsername());
            userInfo.put("email", u.getEmail());
            userInfo.put("role", u.getRole());
            return userInfo;
        }).toList());

        return ResponseEntity.ok(response);
    }
}
