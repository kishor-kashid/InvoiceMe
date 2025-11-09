package com.invoiceme.domain.customer;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

/**
 * Value Object representing a Customer's unique identifier
 */
@Embeddable
public class CustomerId implements Serializable {
    private String id;
    
    // Required for JPA
    protected CustomerId() {
    }
    
    public CustomerId(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Customer ID cannot be null or empty");
        }
        this.id = id;
    }
    
    public static CustomerId generate() {
        return new CustomerId(UUID.randomUUID().toString());
    }
    
    public String getId() {
        return id;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CustomerId that = (CustomerId) o;
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

