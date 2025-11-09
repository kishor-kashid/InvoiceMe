package com.invoiceme.infrastructure.persistence;

import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.payment.Payment;
import com.invoiceme.domain.payment.PaymentId;
import com.invoiceme.domain.payment.PaymentRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA implementation of PaymentRepository
 * Uses Spring Data JPA for automatic implementation
 */
@Repository
public interface JpaPaymentRepository extends JpaRepository<Payment, PaymentId>, PaymentRepository {
    
    @Override
    @SuppressWarnings("unchecked")
    default Payment save(Payment payment) {
        return saveAndFlush(payment);
    }
    
    @Override
    Optional<Payment> findById(PaymentId id);
    
    @Override
    List<Payment> findAll();
    
    @Override
    @Query("SELECT p FROM Payment p WHERE p.invoiceId.id = :#{#invoiceId.id} ORDER BY p.paymentDate DESC")
    List<Payment> findByInvoiceId(@Param("invoiceId") InvoiceId invoiceId);
    
    @Override
    default void delete(Payment payment) {
        deleteById(payment.getId());
    }
    
    @Override
    boolean existsById(PaymentId id);
}

