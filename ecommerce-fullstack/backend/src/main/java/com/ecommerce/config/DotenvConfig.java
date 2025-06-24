package com.ecommerce.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.lang.NonNull;

import java.util.HashMap;
import java.util.Map;

public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(@NonNull ConfigurableApplicationContext applicationContext) {
        // Load .env file if it exists
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .filename(".env")
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        // Add .env properties to Spring Environment
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        Map<String, Object> dotenvProperties = new HashMap<>();
        
        dotenv.entries().forEach(entry -> {
            String key = entry.getKey();
            String value = entry.getValue();
            
            // Set system properties for Spring to pick up
            if (value != null && !value.isEmpty()) {
                System.setProperty(key, value);
                dotenvProperties.put(key, value);
            }
        });
        
        if (!dotenvProperties.isEmpty()) {
            environment.getPropertySources().addFirst(
                new MapPropertySource("dotenv", dotenvProperties)
            );
        }
        
        // Log that .env was loaded (without sensitive data)
        System.out.println("Environment configuration loaded from .env file");
    }
}
