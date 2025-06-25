package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    // Обработчик ошибок валидации
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
            System.err.println("🔴 Validation error - " + fieldName + ": " + errorMessage);
        });
        
        return ResponseEntity.badRequest().body(Map.of(
            "message", "Validation failed",
            "errors", errors,
            "timestamp", System.currentTimeMillis()
        ));
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            System.out.println("📝 Registration request received for email: " + request.getEmail());
            System.out.println("📝 First name: " + request.getFirstName());
            System.out.println("📝 Last name: " + request.getLastName());
            System.out.println("📝 Password length: " + (request.getPassword() != null ? request.getPassword().length() : "null"));
            
            AuthResponse response = userService.registerUser(request);
            System.out.println("✅ Registration successful for: " + request.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("❌ Registration failed: " + e.getMessage());
            e.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            System.err.println("❌ Unexpected error during registration: " + e.getMessage());
            e.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse("Internal server error");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // For JWT, logout is handled on the client side by removing the token
        return ResponseEntity.ok(new SuccessResponse("Successfully logged out"));
    }
}
