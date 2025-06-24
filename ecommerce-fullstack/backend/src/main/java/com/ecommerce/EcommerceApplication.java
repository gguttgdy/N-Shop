package com.ecommerce;

import com.ecommerce.config.AppProperties;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class EcommerceApplication {
    public static void main(String[] args) {
        // Load .env file
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .filename(".env")
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();

            // Set system properties for Spring to pick up
            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();
                if (value != null && !value.isEmpty()) {
                    System.setProperty(key, value);
                }
            });
            
            System.out.println("Environment configuration loaded from .env file");
        } catch (Exception e) {
            System.err.println("Could not load .env file: " + e.getMessage());
        }
        
        SpringApplication.run(EcommerceApplication.class, args);
    }
}
