package com.invoiceme.features.auth;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication endpoints
 */
@RestController
@RequestMapping("/api/auth")
public class LoginController {
    
    @Autowired
    private LoginHandler loginHandler;
    
    /**
     * Login endpoint
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        LoginResponseDto response = loginHandler.authenticate(loginDto);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Register endpoint (optional, for creating test users)
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterDto registerDto) {
        loginHandler.register(
            registerDto.getUsername(),
            registerDto.getEmail(),
            registerDto.getPassword()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
            .body("User registered successfully");
    }
}

