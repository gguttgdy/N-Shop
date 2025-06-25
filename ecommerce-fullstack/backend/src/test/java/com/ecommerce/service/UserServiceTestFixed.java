package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.model.User;
import com.ecommerce.model.UserRole;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.InputValidator;
import com.ecommerce.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private InputValidator inputValidator;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("test-id");
        testUser.setEmail("test@example.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setPassword("encoded-password");
        testUser.setRole(UserRole.CUSTOMER);
        testUser.setIsActive(true);
        testUser.setCreatedAt(LocalDateTime.now());

        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setConfirmPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void testRegisterUser_Success() {
        // Given
        doNothing().when(inputValidator).validateUserInput(anyString(), anyString(), anyString(), anyString());
        when(inputValidator.sanitizeInput(anyString())).thenReturn("sanitized");
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("test-token");

        // When
        AuthResponse result = userService.registerUser(registerRequest);

        // Then
        assertNotNull(result);
        assertEquals("test-token", result.getToken());
        assertNotNull(result.getUser());
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        // Given
        doNothing().when(inputValidator).validateUserInput(anyString(), anyString(), anyString(), anyString());
        when(inputValidator.sanitizeInput(anyString())).thenReturn("sanitized");
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.registerUser(registerRequest));
    }

    @Test
    void testRegisterUser_PasswordMismatch() {
        // Given
        doNothing().when(inputValidator).validateUserInput(anyString(), anyString(), anyString(), anyString());
        when(inputValidator.sanitizeInput(anyString())).thenReturn("sanitized");
        registerRequest.setConfirmPassword("different-password");
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.registerUser(registerRequest));
    }

    @Test
    void testLoginUser_Success() {
        // Given
        when(inputValidator.isValidEmail(anyString())).thenReturn(true);
        when(inputValidator.sanitizeInput(anyString())).thenReturn("test@example.com");
        when(userRepository.findByEmailAndIsActiveTrue("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("test-token");

        // When
        AuthResponse result = userService.loginUser(loginRequest);

        // Then
        assertNotNull(result);
        assertEquals("test-token", result.getToken());
        assertNotNull(result.getUser());
        verify(userRepository).save(any(User.class)); // for updating last login
    }

    @Test
    void testLoginUser_UserNotFound() {
        // Given
        when(inputValidator.isValidEmail(anyString())).thenReturn(true);
        when(inputValidator.sanitizeInput(anyString())).thenReturn("test@example.com");
        when(userRepository.findByEmailAndIsActiveTrue("test@example.com")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.loginUser(loginRequest));
    }

    @Test
    void testLoginUser_InvalidPassword() {
        // Given
        when(inputValidator.isValidEmail(anyString())).thenReturn(true);
        when(inputValidator.sanitizeInput(anyString())).thenReturn("test@example.com");
        when(userRepository.findByEmailAndIsActiveTrue("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.loginUser(loginRequest));
    }

    @Test
    void testGetUserById_Success() {
        // Given
        when(userRepository.findById("test-id")).thenReturn(Optional.of(testUser));

        // When
        UserResponse result = userService.getUserById("test-id");

        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
    }

    @Test
    void testGetUserById_UserNotFound() {
        // Given
        when(userRepository.findById("nonexistent-id")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.getUserById("nonexistent-id"));
    }

    @Test
    void testUpdateUser_Success() {
        // Given
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setFirstName("Jane");
        updateRequest.setLastName("Smith");
        updateRequest.setPhoneNumber("+1234567890");

        when(userRepository.findById("test-id")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        UserResponse result = userService.updateUser("test-id", updateRequest);

        // Then
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testUpdateUser_UserNotFound() {
        // Given
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setFirstName("Jane");

        when(userRepository.findById("nonexistent-id")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.updateUser("nonexistent-id", updateRequest));
        verify(userRepository, never()).save(any(User.class));
    }
}
