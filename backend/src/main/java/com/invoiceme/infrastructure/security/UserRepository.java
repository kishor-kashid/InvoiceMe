package com.invoiceme.infrastructure.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for UserEntity
 * Provides data access operations for user authentication
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    
    /**
     * Find user by username
     * @param username the username to search for
     * @return Optional containing UserEntity if found
     */
    Optional<UserEntity> findByUsername(String username);
    
    /**
     * Find user by email
     * @param email the email to search for
     * @return Optional containing UserEntity if found
     */
    Optional<UserEntity> findByEmail(String email);
    
    /**
     * Check if user exists by username
     * @param username the username to check
     * @return true if user exists, false otherwise
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if user exists by email
     * @param email the email to check
     * @return true if user exists, false otherwise
     */
    boolean existsByEmail(String email);
}

