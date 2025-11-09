package com.invoiceme.config;

import com.invoiceme.infrastructure.security.UserEntity;
import com.invoiceme.infrastructure.security.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Data Initializer
 * Creates a default test user on application startup (development only)
 */
@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Create default test user if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            UserEntity adminUser = new UserEntity(
                UUID.randomUUID(),
                "admin",
                "admin@invoiceme.com",
                passwordEncoder.encode("admin123")
            );
            userRepository.save(adminUser);
            System.out.println("Default test user created: username=admin, password=admin123");
        }
    }
}

