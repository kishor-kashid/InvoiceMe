package com.invoiceme.domain.payment;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

/**
 * Value Object representing a Payment's unique identifier
 */
@Embeddable
public class PaymentId implements Serializable {
    private String id;
    
    // Required for JPA
    protected PaymentId() {
    }
    
    public PaymentId(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Payment ID cannot be null or empty");
        }
        this.id = id;
    }
    
    public static PaymentId generate() {
        return new PaymentId(UUID.randomUUID().toString());
    }
    
    public String getId() {
        return id;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PaymentId paymentId = (PaymentId) o;
        return Objects.equals(id, paymentId.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return id;
    }
}

