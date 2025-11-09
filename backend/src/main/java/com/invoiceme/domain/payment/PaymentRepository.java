package com.invoiceme.domain.payment;

import com.invoiceme.domain.invoice.InvoiceId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Payment entity
 * This is a domain interface - implementation will be in infrastructure layer
 */
public interface PaymentRepository {
    
    /**
     * Save a payment
     */
    Payment save(Payment payment);
    
    /**
     * Find a payment by ID
     */
    Optional<Payment> findById(PaymentId id);
    
    /**
     * Find all payments
     */
    List<Payment> findAll();
    
    /**
     * Find all payments with pagination
     */
    Page<Payment> findAll(Pageable pageable);
    
    /**
     * Find all payments for a specific invoice
     */
    List<Payment> findByInvoiceId(InvoiceId invoiceId);
    
    /**
     * Delete a payment
     */
    void delete(Payment payment);
    
    /**
     * Check if a payment exists by ID
     */
    boolean existsById(PaymentId id);
}

