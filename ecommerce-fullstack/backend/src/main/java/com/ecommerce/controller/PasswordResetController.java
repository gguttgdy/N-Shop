package com.ecommerce.controller;

import com.ecommerce.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email is required"));
            }

            boolean result = passwordResetService.initiatePasswordReset(email);
            
            if (result) {
                return ResponseEntity.ok()
                    .body(Map.of("message", "Password reset instructions have been sent to your email"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "An error occurred while processing your request"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            if (token == null || newPassword == null || token.trim().isEmpty() || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Token and new password are required"));
            }

            boolean result = passwordResetService.resetPassword(token, newPassword);
            
            if (result) {
                return ResponseEntity.ok()
                    .body(Map.of("message", "Password has been reset successfully"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid or expired reset token"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "An error occurred while resetting your password"));
        }
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<Map<String, Object>> validateResetToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("valid", false, "error", "Token is required"));
            }

            boolean isValid = passwordResetService.isValidResetToken(token);
            return ResponseEntity.ok()
                .body(Map.of("valid", isValid));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("valid", false, "error", "An error occurred while validating token"));
        }
    }
}
