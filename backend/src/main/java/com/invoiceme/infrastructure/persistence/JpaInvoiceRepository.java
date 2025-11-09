package com.invoiceme.infrastructure.persistence;

import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.invoice.InvoiceRepository;
import com.invoiceme.domain.invoice.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA implementation of InvoiceRepository
 * Uses Spring Data JPA for automatic implementation
 */
@Repository
public interface JpaInvoiceRepository extends JpaRepository<Invoice, InvoiceId>, InvoiceRepository {
    
    @Override
    @SuppressWarnings("unchecked")
    default Invoice save(Invoice invoice) {
        return saveAndFlush(invoice);
    }
    
    @Override
    Optional<Invoice> findById(InvoiceId id);
    
    @Override
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    @Override
    List<Invoice> findAll();
    
    @Override
    @Query("SELECT i FROM Invoice i WHERE i.customerId.id = :#{#customerId.id}")
    List<Invoice> findByCustomerId(@Param("customerId") CustomerId customerId);
    
    @Override
    List<Invoice> findByStatus(InvoiceStatus status);
    
    @Override
    @Query("SELECT i FROM Invoice i WHERE i.customerId.id = :#{#customerId.id} AND i.status = :status")
    List<Invoice> findByCustomerIdAndStatus(@Param("customerId") CustomerId customerId, 
                                           @Param("status") InvoiceStatus status);
    
    @Override
    default void delete(Invoice invoice) {
        deleteById(invoice.getId());
    }
    
    @Override
    boolean existsById(InvoiceId id);
    
    @Override
    boolean existsByInvoiceNumber(String invoiceNumber);
}

