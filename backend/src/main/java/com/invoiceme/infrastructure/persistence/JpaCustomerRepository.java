package com.invoiceme.infrastructure.persistence;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.customer.CustomerRepository;
import com.invoiceme.domain.shared.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA implementation of CustomerRepository
 * Uses Spring Data JPA for automatic implementation
 */
@Repository
public interface JpaCustomerRepository extends JpaRepository<Customer, CustomerId>, CustomerRepository {
    
    @Override
    @SuppressWarnings("unchecked")
    default Customer save(Customer customer) {
        return saveAndFlush(customer);
    }
    
    @Override
    Optional<Customer> findById(CustomerId id);
    
    @Override
    @Query("SELECT c FROM Customer c WHERE c.email.value = :#{#email.value}")
    Optional<Customer> findByEmail(@Param("email") Email email);
    
    @Override
    List<Customer> findAll();
    
    @Override
    default void delete(Customer customer) {
        deleteById(customer.getId());
    }
    
    @Override
    boolean existsById(CustomerId id);
    
    @Override
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Customer c WHERE c.email.value = :#{#email.value}")
    boolean existsByEmail(@Param("email") Email email);
}

