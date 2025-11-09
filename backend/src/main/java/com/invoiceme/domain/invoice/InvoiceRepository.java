package com.invoiceme.domain.invoice;

import com.invoiceme.domain.customer.CustomerId;
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
     * Find invoices by customer ID
     */
    List<Invoice> findByCustomerId(CustomerId customerId);
    
    /**
     * Find invoices by status
     */
    List<Invoice> findByStatus(InvoiceStatus status);
    
    /**
     * Find invoices by customer and status
     */
    List<Invoice> findByCustomerIdAndStatus(CustomerId customerId, InvoiceStatus status);
    
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

