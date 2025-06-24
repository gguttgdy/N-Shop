package com.ecommerce.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Configuration
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    
    private JWT jwt = new JWT();
    private Security security = new Security();
    private Upload upload = new Upload();
    
    public JWT getJwt() {
        return jwt;
    }
    
    public void setJwt(JWT jwt) {
        this.jwt = jwt;
    }
    
    public Security getSecurity() {
        return security;
    }
    
    public void setSecurity(Security security) {
        this.security = security;
    }
    
    public Upload getUpload() {
        return upload;
    }
    
    public void setUpload(Upload upload) {
        this.upload = upload;
    }
    
    public static class JWT {
        @NotBlank(message = "JWT secret cannot be blank")
        private String secret;
        
        @NotNull
        @Min(value = 60000, message = "JWT expiration must be at least 1 minute")
        private Long expiration;
        
        public String getSecret() {
            return secret;
        }
        
        public void setSecret(String secret) {
            this.secret = secret;
        }
        
        public Long getExpiration() {
            return expiration;
        }
        
        public void setExpiration(Long expiration) {
            this.expiration = expiration;
        }
    }
    
    public static class Security {
        private RateLimit rateLimit = new RateLimit();
        
        public RateLimit getRateLimit() {
            return rateLimit;
        }
        
        public void setRateLimit(RateLimit rateLimit) {
            this.rateLimit = rateLimit;
        }
        
        public static class RateLimit {
            @Min(value = 1, message = "Rate limit requests must be at least 1")
            private Integer requests = 100;
            
            @Min(value = 1000, message = "Rate limit window must be at least 1 second")
            private Long window = 3600000L;
            
            public Integer getRequests() {
                return requests;
            }
            
            public void setRequests(Integer requests) {
                this.requests = requests;
            }
            
            public Long getWindow() {
                return window;
            }
            
            public void setWindow(Long window) {
                this.window = window;
            }
        }
    }
    
    public static class Upload {
        @NotBlank(message = "Upload directory cannot be blank")
        private String directory = "uploads/";
        
        public String getDirectory() {
            return directory;
        }
        
        public void setDirectory(String directory) {
            this.directory = directory;
        }
    }
}
