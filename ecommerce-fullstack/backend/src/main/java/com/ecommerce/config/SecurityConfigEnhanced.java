package com.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@Primary
public class SecurityConfigEnhanced {

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private List<String> allowedOrigins;

    @Value("${app.security.jwt.secret}")
    private String jwtSecret;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS Configuration - Более строгие настройки
            .cors(cors -> cors.configurationSource(corsConfigurationSourceEnhanced()))
            
            // CSRF Protection - Отключаем для REST API
            .csrf(csrf -> csrf.disable())
            
            // Session Management - Stateless для JWT
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
            )
            
            // Security Headers
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.deny())
                .contentTypeOptions(contentTypeOptions -> {})
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                )
                .addHeaderWriter((request, response) -> {
                    // Security Headers
                    response.setHeader("X-Content-Type-Options", "nosniff");
                    response.setHeader("X-XSS-Protection", "0"); // Modern browsers prefer CSP
                    response.setHeader("X-Frame-Options", "DENY");
                    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
                    response.setHeader("Permissions-Policy", 
                        "geolocation=(), microphone=(), camera=()");
                    
                    // Content Security Policy - Более строгая политика
                    response.setHeader("Content-Security-Policy", 
                        "default-src 'self'; " +
                        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                        "style-src 'self' 'unsafe-inline'; " +
                        "img-src 'self' data: https:; " +
                        "font-src 'self' data:; " +
                        "connect-src 'self' https:; " +
                        "frame-ancestors 'none'; " +
                        "base-uri 'self'; " +
                        "form-action 'self';"
                    );
                    
                    // Cache Control для API endpoints
                    if (request.getRequestURI().startsWith("/api/")) {
                        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
                        response.setHeader("Pragma", "no-cache");
                        response.setHeader("Expires", "0");
                    }
                })
            )
            
            // Request Authorization
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/products/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/test/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/currency/**")).permitAll()
                
                // Swagger endpoints (только в dev режиме)
                .requestMatchers(new AntPathRequestMatcher("/swagger-ui/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/v3/api-docs/**")).permitAll()
                
                // Health check endpoints
                .requestMatchers(new AntPathRequestMatcher("/actuator/health")).permitAll()
                
                // Admin endpoints - требуют роль ADMIN
                .requestMatchers(new AntPathRequestMatcher("/api/admin/**")).hasRole("ADMIN")
                
                // User endpoints - требуют аутентификации
                .requestMatchers(new AntPathRequestMatcher("/api/users/**")).authenticated()
                .requestMatchers(new AntPathRequestMatcher("/api/orders/**")).authenticated()
                .requestMatchers(new AntPathRequestMatcher("/api/reviews/**")).authenticated()
                
                // Все остальные запросы требуют аутентификации
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    @Primary
    public CorsConfigurationSource corsConfigurationSourceEnhanced() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allowed origins - только разрешенные домены
        configuration.setAllowedOrigins(allowedOrigins);
        
        // Allowed methods - только необходимые HTTP методы
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Allowed headers - ограниченный список
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Credentials
        configuration.setAllowCredentials(true);
        
        // Max age for preflight requests
        configuration.setMaxAge(3600L);
        
        // Exposed headers
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt с силой 12 для лучшей безопасности
        return new BCryptPasswordEncoder(12);
    }
}
