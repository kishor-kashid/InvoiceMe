package com.invoiceme.config;

import com.invoiceme.infrastructure.security.UserEntity;
import com.invoiceme.infrastructure.security.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Data Initializer
 * Creates default admin user on application startup
 */
@Component
@Profile("!test") // Don't run during tests
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            // Create default admin user
            UserEntity admin = new UserEntity(
                    "admin",
                    passwordEncoder.encode("admin123"),
                    "admin@invoiceme.com",
                    Set.of("ADMIN", "USER")
            );
            
            userRepository.save(admin);
            
            logger.info("=".repeat(60));
            logger.info("Default admin user created");
            logger.info("Username: admin");
            logger.info("Password: admin123");
            logger.info("IMPORTANT: Change this password in production!");
            logger.info("=".repeat(60));
        }
    }
}

