package com.invoiceme.features.auth;

import com.invoiceme.infrastructure.security.JwtService;
import com.invoiceme.infrastructure.security.UserEntity;
import com.invoiceme.infrastructure.security.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

/**
 * Login Handler
 * Handles user authentication and JWT token generation
 */
@Service
public class LoginHandler {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Authenticate user and generate JWT token
     */
    public LoginResponseDto handle(LoginDto loginDto) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsername(),
                        loginDto.getPassword()
                )
        );
        
        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginDto.getUsername());
        
        // Generate JWT token
        String token = jwtService.generateToken(userDetails);
        
        // Get user entity for additional info
        UserEntity user = userRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Return response
        return new LoginResponseDto(token, user.getUsername(), user.getEmail());
    }
}

