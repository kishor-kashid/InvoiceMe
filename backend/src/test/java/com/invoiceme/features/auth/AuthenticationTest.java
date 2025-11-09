package com.invoiceme.features.auth;

import com.invoiceme.infrastructure.security.JwtService;
import com.invoiceme.infrastructure.security.UserEntity;
import com.invoiceme.infrastructure.security.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Authentication Tests
 * Tests login functionality and JWT token generation
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthenticationTest {
    
    @Autowired
    private LoginHandler loginHandler;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    private UserEntity testUser;
    
    @BeforeEach
    void setUp() {
        // Clean up
        userRepository.deleteAll();
        
        // Create test user
        testUser = new UserEntity(
                "testuser",
                passwordEncoder.encode("password123"),
                "test@example.com",
                Set.of("USER")
        );
        userRepository.save(testUser);
    }
    
    @Test
    void testSuccessfulLogin() {
        // Given
        LoginDto loginDto = new LoginDto("testuser", "password123");
        
        // When
        LoginResponseDto response = loginHandler.handle(loginDto);
        
        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
    }
    
    @Test
    void testLoginWithWrongPassword() {
        // Given
        LoginDto loginDto = new LoginDto("testuser", "wrongpassword");
        
        // When & Then
        assertThrows(BadCredentialsException.class, () -> {
            loginHandler.handle(loginDto);
        });
    }
    
    @Test
    void testLoginWithNonExistentUser() {
        // Given
        LoginDto loginDto = new LoginDto("nonexistent", "password123");
        
        // When & Then
        assertThrows(BadCredentialsException.class, () -> {
            loginHandler.handle(loginDto);
        });
    }
    
    @Test
    void testJwtTokenGeneration() {
        // Given
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");
        
        // When
        String token = jwtService.generateToken(userDetails);
        
        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }
    
    @Test
    void testJwtTokenValidation() {
        // Given
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");
        String token = jwtService.generateToken(userDetails);
        
        // When
        String extractedUsername = jwtService.extractUsername(token);
        Boolean isValid = jwtService.validateToken(token, userDetails);
        
        // Then
        assertEquals("testuser", extractedUsername);
        assertTrue(isValid);
    }
    
    @Test
    void testJwtTokenInvalidForDifferentUser() {
        // Given
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");
        String token = jwtService.generateToken(userDetails);
        
        // Create another user
        UserEntity anotherUser = new UserEntity(
                "anotheruser",
                passwordEncoder.encode("password123"),
                "another@example.com",
                Set.of("USER")
        );
        userRepository.save(anotherUser);
        
        UserDetails anotherUserDetails = userDetailsService.loadUserByUsername("anotheruser");
        
        // When
        Boolean isValid = jwtService.validateToken(token, anotherUserDetails);
        
        // Then
        assertFalse(isValid);
    }
    
    @Test
    void testUserDetailsServiceLoadUser() {
        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");
        
        // Then
        assertNotNull(userDetails);
        assertEquals("testuser", userDetails.getUsername());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
    }
    
    @Test
    void testUserWithMultipleRoles() {
        // Given
        UserEntity adminUser = new UserEntity(
                "admin",
                passwordEncoder.encode("admin123"),
                "admin@example.com",
                Set.of("USER", "ADMIN")
        );
        userRepository.save(adminUser);
        
        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername("admin");
        
        // Then
        assertNotNull(userDetails);
        assertEquals(2, userDetails.getAuthorities().size());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
    }
}

