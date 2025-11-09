package com.invoiceme.domain.invoice;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

/**
 * Value Object representing an Invoice's unique identifier
 */
@Embeddable
public class InvoiceId implements Serializable {
    private String id;
    
    // Required for JPA
    protected InvoiceId() {
    }
    
    public InvoiceId(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Invoice ID cannot be null or empty");
        }
        this.id = id;
    }
    
    public static InvoiceId generate() {
        return new InvoiceId(UUID.randomUUID().toString());
    }
    
    public String getId() {
        return id;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InvoiceId that = (InvoiceId) o;
        return Objects.equals(id, that.id);
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

