package com.invoiceme.features.auth;

import com.invoiceme.infrastructure.security.JwtService;
import com.invoiceme.infrastructure.security.UserEntity;
import com.invoiceme.infrastructure.security.UserRepository;
import com.invoiceme.shared.exceptions.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for login authentication
 * Validates credentials and generates JWT token
 */
@Service
@Transactional
public class LoginHandler {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Authenticate user and generate JWT token
     */
    public LoginResponseDto authenticate(LoginDto loginDto) {
        // Authenticate user
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(),
                loginDto.getPassword()
            )
        );
        
        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginDto.getUsername());
        
        // Generate JWT token
        String token = jwtService.generateToken(userDetails);
        
        return new LoginResponseDto(token, loginDto.getUsername());
    }
    
    /**
     * Register a new user (optional utility method)
     */
    public void register(String username, String email, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new BusinessException("Username already exists: " + username);
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("Email already exists: " + email);
        }
        
        UserEntity user = new UserEntity(
            null,
            username,
            email,
            passwordEncoder.encode(password)
        );
        
        userRepository.save(user);
    }
}

