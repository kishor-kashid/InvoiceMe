package com.invoiceme.domain.invoice;

import com.invoiceme.domain.customer.CustomerId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Invoice aggregate
 * This is a domain interface - implementation will be in infrastructure layer
 */
public interface InvoiceRepository {
    
    /**
     * Save an invoice
     */
    Invoice save(Invoice invoice);
    
    /**
     * Find an invoice by ID
     */
    Optional<Invoice> findById(InvoiceId id);
    
    /**
     * Find an invoice by invoice number
     */
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    /**
     * Find all invoices
     */
    List<Invoice> findAll();
    
    /**
     * Find all invoices with pagination
     */
    Page<Invoice> findAll(Pageable pageable);
    
    /**
     * Find invoices by customer ID
     */
    List<Invoice> findByCustomerId(CustomerId customerId);
    
    /**
     * Find invoices by status
     */
    List<Invoice> findByStatus(InvoiceStatus status);
    
    /**
     * Find invoices by status with pagination
     */
    Page<Invoice> findByStatus(InvoiceStatus status, Pageable pageable);
    
    /**
     * Find invoices by customer and status
     */
    List<Invoice> findByCustomerIdAndStatus(CustomerId customerId, InvoiceStatus status);
    
    /**
     * Find invoices by customer with pagination
     */
    Page<Invoice> findByCustomerId(CustomerId customerId, Pageable pageable);
    
    /**
     * Delete an invoice
     */
    void delete(Invoice invoice);
    
    /**
     * Check if an invoice exists by ID
     */
    boolean existsById(InvoiceId id);
    
    /**
     * Check if an invoice number is already used
     */
    boolean existsByInvoiceNumber(String invoiceNumber);
}

