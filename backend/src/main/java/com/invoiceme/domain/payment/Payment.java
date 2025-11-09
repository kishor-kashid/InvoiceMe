package com.invoiceme.domain.payment;

import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.shared.Money;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Payment Entity
 * Represents a payment made against an invoice
 */
@Entity
@Table(name = "payments")
public class Payment {
    
    @EmbeddedId
    private PaymentId id;
    
    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "invoice_id", nullable = false))
    private InvoiceId invoiceId;
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "amount", column = @Column(name = "amount")),
        @AttributeOverride(name = "currency", column = @Column(name = "currency"))
    })
    private Money amount;
    
    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;
    
    @Column(name = "reference_number", length = 100)
    private String referenceNumber;
    
    @Column(name = "notes", length = 500)
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Required for JPA
    protected Payment() {
    }
    
    public Payment(PaymentId id, InvoiceId invoiceId, Money amount, 
                   LocalDateTime paymentDate, String paymentMethod, 
                   String referenceNumber, String notes) {
        if (id == null) {
            throw new IllegalArgumentException("Payment ID cannot be null");
        }
        if (invoiceId == null) {
            throw new IllegalArgumentException("Invoice ID cannot be null");
        }
        if (amount == null) {
            throw new IllegalArgumentException("Payment amount cannot be null");
        }
        if (amount.isZero()) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }
        if (paymentDate == null) {
            throw new IllegalArgumentException("Payment date cannot be null");
        }
        
        this.id = id;
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod != null ? paymentMethod.trim() : null;
        this.referenceNumber = referenceNumber != null ? referenceNumber.trim() : null;
        this.notes = notes != null ? notes.trim() : null;
        this.createdAt = LocalDateTime.now();
    }
    
    public static Payment create(InvoiceId invoiceId, Money amount, 
                                LocalDateTime paymentDate, String paymentMethod, 
                                String referenceNumber, String notes) {
        return new Payment(PaymentId.generate(), invoiceId, amount, 
                         paymentDate, paymentMethod, referenceNumber, notes);
    }
    
    public static Payment create(InvoiceId invoiceId, Money amount) {
        return create(invoiceId, amount, LocalDateTime.now(), null, null, null);
    }
    
    // Getters
    public PaymentId getId() {
        return id;
    }
    
    public InvoiceId getInvoiceId() {
        return invoiceId;
    }
    
    public Money getAmount() {
        return amount;
    }
    
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public String getReferenceNumber() {
        return referenceNumber;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Payment payment = (Payment) o;
        return Objects.equals(id, payment.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Payment{" +
                "id=" + id +
                ", invoiceId=" + invoiceId +
                ", amount=" + amount +
                ", paymentDate=" + paymentDate +
                '}';
    }
}

