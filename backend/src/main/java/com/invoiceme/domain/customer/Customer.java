package com.invoiceme.domain.customer;

import com.invoiceme.domain.shared.Address;
import com.invoiceme.domain.shared.Email;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Customer Aggregate Root
 * Represents a customer in the invoicing system
 */
@Entity
@Table(name = "customers")
public class Customer {
    
    @EmbeddedId
    private CustomerId id;
    
    @Column(nullable = false)
    private String name;
    
    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "email", nullable = false, unique = true))
    private Email email;
    
    @Column(length = 20)
    private String phone;
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "street", column = @Column(name = "address_street")),
        @AttributeOverride(name = "city", column = @Column(name = "address_city")),
        @AttributeOverride(name = "state", column = @Column(name = "address_state")),
        @AttributeOverride(name = "zipCode", column = @Column(name = "address_zip_code")),
        @AttributeOverride(name = "country", column = @Column(name = "address_country"))
    })
    private Address address;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Required for JPA
    protected Customer() {
    }
    
    public Customer(CustomerId id, String name, Email email, String phone, Address address) {
        if (id == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Customer name cannot be null or empty");
        }
        if (email == null) {
            throw new IllegalArgumentException("Customer email cannot be null");
        }
        
        this.id = id;
        this.name = name.trim();
        this.email = email;
        this.phone = phone != null ? phone.trim() : null;
        this.address = address;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public static Customer create(String name, Email email, String phone, Address address) {
        return new Customer(CustomerId.generate(), name, email, phone, address);
    }
    
    // Business methods
    public void updateDetails(String name, Email email, String phone, Address address) {
        if (name != null && !name.isBlank()) {
            this.name = name.trim();
        }
        if (email != null) {
            this.email = email;
        }
        if (phone != null) {
            this.phone = phone.trim();
        }
        if (address != null) {
            this.address = address;
        }
        this.updatedAt = LocalDateTime.now();
    }
    
    public void updateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Customer name cannot be null or empty");
        }
        this.name = name.trim();
        this.updatedAt = LocalDateTime.now();
    }
    
    public void updateEmail(Email email) {
        if (email == null) {
            throw new IllegalArgumentException("Customer email cannot be null");
        }
        this.email = email;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void updatePhone(String phone) {
        this.phone = phone != null ? phone.trim() : null;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void updateAddress(Address address) {
        this.address = address;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public CustomerId getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public Email getEmail() {
        return email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public Address getAddress() {
        return address;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Customer customer = (Customer) o;
        return Objects.equals(id, customer.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email=" + email +
                '}';
    }
}

