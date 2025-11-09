package com.invoiceme.infrastructure.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User Entity
 * Provides database access for user authentication
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    
    /**
     * Find user by username
     */
    Optional<UserEntity> findByUsername(String username);
    
    /**
     * Find user by email
     */
    Optional<UserEntity> findByEmail(String email);
    
    /**
     * Check if username exists
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
}

