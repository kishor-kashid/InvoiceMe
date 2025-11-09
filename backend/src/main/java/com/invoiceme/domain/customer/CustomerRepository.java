package com.invoiceme.domain.customer;

import com.invoiceme.domain.shared.Email;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Customer aggregate
 * This is a domain interface - implementation will be in infrastructure layer
 */
public interface CustomerRepository {
    
    /**
     * Save a customer
     */
    Customer save(Customer customer);
    
    /**
     * Find a customer by ID
     */
    Optional<Customer> findById(CustomerId id);
    
    /**
     * Find a customer by email
     */
    Optional<Customer> findByEmail(Email email);
    
    /**
     * Find all customers
     */
    List<Customer> findAll();
    
    /**
     * Find all customers with pagination
     */
    Page<Customer> findAll(Pageable pageable);
    
    /**
     * Delete a customer
     */
    void delete(Customer customer);
    
    /**
     * Check if a customer exists by ID
     */
    boolean existsById(CustomerId id);
    
    /**
     * Check if a customer exists by email
     */
    boolean existsByEmail(Email email);
}

