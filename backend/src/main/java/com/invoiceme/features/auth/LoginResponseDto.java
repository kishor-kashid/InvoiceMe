package com.invoiceme.features.auth;

/**
 * DTO for login response
 */
public class LoginResponseDto {
    
    private String token;
    private String type = "Bearer";
    private String username;
    
    public LoginResponseDto() {
    }
    
    public LoginResponseDto(String token, String username) {
        this.token = token;
        this.username = username;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
}

