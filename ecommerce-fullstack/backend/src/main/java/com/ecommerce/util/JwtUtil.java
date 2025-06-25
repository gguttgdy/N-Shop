package com.ecommerce.util;

import com.ecommerce.config.AppProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Component
public class JwtUtil {
    
    private final AppProperties appProperties;
    
    @Autowired
    public JwtUtil(AppProperties appProperties) {
        this.appProperties = appProperties;
    }
    
    private SecretKey getSigningKey() {
        try {
            // Hash the secret to ensure it's always the right length for HMAC-SHA256
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = sha.digest(appProperties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error creating JWT signing key", e);
        }
    }
    
    public String generateToken(String userId, String email) {
        long currentTime = System.currentTimeMillis();
        Date expiryDate = new Date(currentTime + appProperties.getJwt().getExpiration());
        
        return Jwts.builder()
                .subject(userId)
                .claim("email", email)
                .claim("iat", currentTime / 1000) // Issued at time in seconds
                .issuedAt(new Date(currentTime))
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }
      public String getUserIdFromToken(String token) {
        try {
            System.out.println("Extracting user ID from token");
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            
            String userId = claims.getSubject();
            System.out.println("Extracted user ID: " + userId);
            return userId;
        } catch (Exception e) {
            System.out.println("Error extracting user ID from token: " + e.getMessage());
            throw e;
        }
    }
    
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        
        return claims.get("email", String.class);
    }
      public boolean validateToken(String token) {
        try {
            System.out.println("Validating token: " + token.substring(0, Math.min(20, token.length())) + "...");
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            System.out.println("Token validation successful");
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }
    
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            
            return claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return true;
        }
    }
}
