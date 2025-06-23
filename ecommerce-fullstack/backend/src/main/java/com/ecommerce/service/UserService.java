package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.model.User;
import com.ecommerce.model.UserRole;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse registerUser(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with email " + request.getEmail() + " already exists");
        }
        
        // Validate password confirmation
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Password and confirmation password do not match");
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setProvider("local");
        user.setRole(UserRole.CUSTOMER);
        user.setIsActive(true);
        user.setEmailVerified(false);
          // Set address information if provided, otherwise set empty strings
        user.setAddress(request.getAddress() != null ? request.getAddress() : "");
        user.setCity(request.getCity() != null ? request.getCity() : "");
        user.setState(request.getState() != null ? request.getState() : "");
        user.setCountry(request.getCountry() != null ? request.getCountry() : "");
        user.setPostalCode(request.getPostalCode() != null ? request.getPostalCode() : "");
        user.setApartment(request.getApartment() != null ? request.getApartment() : "");
        
        // Save user
        User savedUser = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail());
        
        // Create response
        UserResponse userResponse = convertToUserResponse(savedUser);
        return new AuthResponse(token, userResponse);
    }
    
    public AuthResponse loginUser(LoginRequest request) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmailAndIsActiveTrue(request.getEmail());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }
        
        User user = userOptional.get();
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Update last login
        user.setLastLogin(LocalDateTime.now());
        user.updateTimestamp();
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        
        // Create response
        UserResponse userResponse = convertToUserResponse(user);
        return new AuthResponse(token, userResponse);
    }
    
    public UserResponse getUserById(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        
        return convertToUserResponse(userOptional.get());
    }
    
    public UserResponse getUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmailAndIsActiveTrue(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }
        
        return convertToUserResponse(userOptional.get());
    }
    
    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        
        User user = userOptional.get();
        
        // Update fields if provided
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }
        
        // Update address information
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        if (request.getState() != null) {
            user.setState(request.getState());
        }
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }
        if (request.getPostalCode() != null) {
            user.setPostalCode(request.getPostalCode());
        }
        if (request.getApartment() != null) {
            user.setApartment(request.getApartment());
        }
        
        // Update billing information
        if (request.getBillingAddress() != null) {
            user.setBillingAddress(request.getBillingAddress());
        }
        if (request.getBillingCity() != null) {
            user.setBillingCity(request.getBillingCity());
        }
        if (request.getBillingState() != null) {
            user.setBillingState(request.getBillingState());
        }
        if (request.getBillingCountry() != null) {
            user.setBillingCountry(request.getBillingCountry());
        }
        if (request.getBillingPostalCode() != null) {
            user.setBillingPostalCode(request.getBillingPostalCode());
        }
        if (request.getBillingApartment() != null) {
            user.setBillingApartment(request.getBillingApartment());
        }
        
        user.updateTimestamp();
        User savedUser = userRepository.save(user);
        
        return convertToUserResponse(savedUser);
    }
    
    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setDateOfBirth(user.getDateOfBirth());
        response.setRole(user.getRole());
        response.setEmailVerified(user.getEmailVerified());
        response.setCreatedAt(user.getCreatedAt());        response.setLastLogin(user.getLastLogin());
        response.setProvider(user.getProvider());
        response.setProfileImageUrl(user.getProfileImageUrl());
        
        // Set address information
        response.setAddress(user.getAddress());
        response.setCity(user.getCity());
        response.setState(user.getState());
        response.setCountry(user.getCountry());
        response.setPostalCode(user.getPostalCode());
        response.setApartment(user.getApartment());
        
        // Set billing information
        response.setBillingAddress(user.getBillingAddress());
        response.setBillingCity(user.getBillingCity());
        response.setBillingState(user.getBillingState());
        response.setBillingCountry(user.getBillingCountry());
        response.setBillingPostalCode(user.getBillingPostalCode());
        response.setBillingApartment(user.getBillingApartment());
        return response;
    }
}
