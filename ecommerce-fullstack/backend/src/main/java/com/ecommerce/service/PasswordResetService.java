package com.ecommerce.service;

import com.ecommerce.model.PasswordResetToken;
import com.ecommerce.model.User;
import com.ecommerce.repository.PasswordResetTokenRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean initiatePasswordReset(String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return false;
            }

            User user = userOpt.get();

            // Деактивируем все существующие токены для этого пользователя
            List<PasswordResetToken> existingTokens = tokenRepository.findByUserAndUsedFalse(user);
            for (PasswordResetToken token : existingTokens) {
                token.setUsed(true);
                tokenRepository.save(token);
            }

            // Создаем новый токен
            String token = UUID.randomUUID().toString();
            LocalDateTime expiryDate = LocalDateTime.now().plusHours(1); // Токен действует 1 час

            PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
            tokenRepository.save(resetToken);

            // Отправляем email (в реальной системе здесь был бы реальный email сервис)
            emailService.sendPasswordResetEmail(user.getEmail(), token);

            System.out.println("Password reset token generated for user: " + user.getEmail());
            System.out.println("Reset token: " + token);
            System.out.println("Reset URL: http://localhost:3000/reset-password?token=" + token);

            return true;
        } catch (Exception e) {
            System.err.println("Error initiating password reset: " + e.getMessage());
            return false;
        }
    }

    public boolean resetPassword(String token, String newPassword) {
        try {
            Optional<PasswordResetToken> tokenOpt = tokenRepository.findValidToken(token, LocalDateTime.now());
            if (!tokenOpt.isPresent()) {
                return false;
            }

            PasswordResetToken resetToken = tokenOpt.get();
            User user = resetToken.getUser();

            // Обновляем пароль пользователя
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
            userRepository.save(user);

            // Помечаем токен как использованный
            resetToken.setUsed(true);
            tokenRepository.save(resetToken);

            System.out.println("Password reset successfully for user: " + user.getEmail());

            return true;
        } catch (Exception e) {
            System.err.println("Error resetting password: " + e.getMessage());
            return false;
        }
    }

    public boolean isValidResetToken(String token) {
        try {
            Optional<PasswordResetToken> tokenOpt = tokenRepository.findValidToken(token, LocalDateTime.now());
            return tokenOpt.isPresent();
        } catch (Exception e) {
            System.err.println("Error validating reset token: " + e.getMessage());
            return false;
        }
    }

    // Метод для очистки просроченных токенов (может быть вызван по расписанию)
    public void cleanupExpiredTokens() {
        try {
            tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
            System.out.println("Cleaned up expired password reset tokens");
        } catch (Exception e) {
            System.err.println("Error cleaning up expired tokens: " + e.getMessage());
        }
    }
}
