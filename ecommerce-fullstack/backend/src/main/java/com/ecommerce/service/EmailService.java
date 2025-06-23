package com.ecommerce.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendPasswordResetEmail(String email, String token) {
        // В реальной системе здесь была бы интеграция с SMTP сервером
        // Для демонстрации просто выводим в консоль
        
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
        
        System.out.println("==== PASSWORD RESET EMAIL ====");
        System.out.println("To: " + email);
        System.out.println("Subject: Password Reset Request");
        System.out.println("Body:");
        System.out.println("Dear User,");
        System.out.println("");
        System.out.println("You have requested to reset your password. Please click the link below to reset your password:");
        System.out.println("");
        System.out.println(resetUrl);
        System.out.println("");
        System.out.println("This link will expire in 1 hour.");
        System.out.println("");
        System.out.println("If you did not request this password reset, please ignore this email.");
        System.out.println("");
        System.out.println("Best regards,");
        System.out.println("E-commerce Team");
        System.out.println("===============================");
    }

    public void sendPasswordResetConfirmation(String email) {
        System.out.println("==== PASSWORD RESET CONFIRMATION ====");
        System.out.println("To: " + email);
        System.out.println("Subject: Password Reset Successful");
        System.out.println("Body:");
        System.out.println("Dear User,");
        System.out.println("");
        System.out.println("Your password has been successfully reset.");
        System.out.println("");
        System.out.println("If you did not make this change, please contact our support team immediately.");
        System.out.println("");
        System.out.println("Best regards,");
        System.out.println("E-commerce Team");
        System.out.println("======================================");
    }
}
