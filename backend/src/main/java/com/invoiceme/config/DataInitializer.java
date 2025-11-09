package com.invoiceme.config;

import com.invoiceme.infrastructure.security.UserEntity;
import com.invoiceme.infrastructure.security.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Data Initializer
 * Creates default admin user on application startup
 * 
 * For Production: Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_EMAIL environment variables
 * For Development: Uses defaults from application.properties if env vars not set
 */
@Component
@Profile("!test") // Don't run during tests
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${app.admin.username:admin}")
    private String defaultAdminUsername;
    
    @Value("${app.admin.password:admin123}")
    private String defaultAdminPassword;
    
    @Value("${app.admin.email:admin@invoiceme.com}")
    private String defaultAdminEmail;
    
    @Override
    public void run(String... args) throws Exception {
        // Check environment variables first (production mode)
        String adminUsername = System.getenv("ADMIN_USERNAME");
        String adminPassword = System.getenv("ADMIN_PASSWORD");
        String adminEmail = System.getenv("ADMIN_EMAIL");
        
        // Fall back to properties if environment variables not set (development mode)
        if (adminUsername == null || adminUsername.isEmpty()) {
            adminUsername = defaultAdminUsername;
        }
        if (adminPassword == null || adminPassword.isEmpty()) {
            adminPassword = defaultAdminPassword;
        }
        if (adminEmail == null || adminEmail.isEmpty()) {
            adminEmail = defaultAdminEmail;
        }
        
        // Check if user already exists
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            // Create admin user
            UserEntity admin = new UserEntity(
                    adminUsername,
                    passwordEncoder.encode(adminPassword),
                    adminEmail,
                    Set.of("ADMIN", "USER")
            );
            
            userRepository.save(admin);
            
            // Logging behavior based on whether using environment variables
            boolean usingEnvVars = System.getenv("ADMIN_USERNAME") != null 
                    || System.getenv("ADMIN_PASSWORD") != null;
            
            if (usingEnvVars) {
                // Production mode - don't log credentials
                logger.info("=".repeat(60));
                logger.info("Admin user created from environment variables");
                logger.info("Username: {}", adminUsername);
                logger.info("Email: {}", adminEmail);
                logger.info("Password: [SET FROM ENVIRONMENT VARIABLE]");
                logger.info("=".repeat(60));
            } else {
                // Development mode - log with warning
                logger.warn("=".repeat(60));
                logger.warn("⚠️  DEVELOPMENT MODE: Using default credentials");
                logger.warn("⚠️  Set ADMIN_USERNAME and ADMIN_PASSWORD environment variables for production!");
                logger.warn("Username: {}", adminUsername);
                logger.warn("Password: {}", adminPassword);
                logger.warn("Email: {}", adminEmail);
                logger.warn("=".repeat(60));
            }
        } else {
            logger.debug("Admin user '{}' already exists, skipping creation", adminUsername);
        }
    }
}

