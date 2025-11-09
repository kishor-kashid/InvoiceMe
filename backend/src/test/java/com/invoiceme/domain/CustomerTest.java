package com.invoiceme.domain;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.shared.Address;
import com.invoiceme.domain.shared.Email;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Customer domain entity
 */
class CustomerTest {
    
    @Test
    void shouldCreateCustomerWithValidData() {
        // Given
        CustomerId id = CustomerId.generate();
        String name = "John Doe";
        Email email = new Email("john.doe@example.com");
        String phone = "+1234567890";
        Address address = new Address("123 Main St", "New York", "NY", "10001", "USA");
        
        // When
        Customer customer = new Customer(id, name, email, phone, address);
        
        // Then
        assertNotNull(customer);
        assertEquals(id, customer.getId());
        assertEquals(name, customer.getName());
        assertEquals(email, customer.getEmail());
        assertEquals(phone, customer.getPhone());
        assertEquals(address, customer.getAddress());
        assertNotNull(customer.getCreatedAt());
        assertNotNull(customer.getUpdatedAt());
    }
    
    @Test
    void shouldCreateCustomerUsingFactoryMethod() {
        // Given
        String name = "Jane Smith";
        Email email = new Email("jane.smith@example.com");
        String phone = "+9876543210";
        Address address = new Address("456 Oak Ave", "Los Angeles", "CA", "90001", "USA");
        
        // When
        Customer customer = Customer.create(name, email, phone, address);
        
        // Then
        assertNotNull(customer);
        assertNotNull(customer.getId());
        assertEquals(name, customer.getName());
        assertEquals(email, customer.getEmail());
    }
    
    @Test
    void shouldThrowExceptionWhenCustomerIdIsNull() {
        // Given
        Email email = new Email("test@example.com");
        Address address = new Address("123 Main St", "City", "State", "12345", "Country");
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> 
            new Customer(null, "John Doe", email, "+123", address)
        );
    }
    
    @Test
    void shouldThrowExceptionWhenNameIsNull() {
        // Given
        CustomerId id = CustomerId.generate();
        Email email = new Email("test@example.com");
        Address address = new Address("123 Main St", "City", "State", "12345", "Country");
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> 
            new Customer(id, null, email, "+123", address)
        );
    }
    
    @Test
    void shouldThrowExceptionWhenEmailIsNull() {
        // Given
        CustomerId id = CustomerId.generate();
        Address address = new Address("123 Main St", "City", "State", "12345", "Country");
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> 
            new Customer(id, "John Doe", null, "+123", address)
        );
    }
    
    @Test
    void shouldUpdateCustomerDetails() {
        // Given
        Customer customer = Customer.create(
            "Original Name",
            new Email("original@example.com"),
            "+111",
            new Address("Old Street", "Old City", "OS", "11111", "Old Country")
        );
        
        String newName = "Updated Name";
        Email newEmail = new Email("updated@example.com");
        String newPhone = "+222";
        Address newAddress = new Address("New Street", "New City", "NS", "22222", "New Country");
        
        // When
        customer.updateDetails(newName, newEmail, newPhone, newAddress);
        
        // Then
        assertEquals(newName, customer.getName());
        assertEquals(newEmail, customer.getEmail());
        assertEquals(newPhone, customer.getPhone());
        assertEquals(newAddress, customer.getAddress());
    }
    
    @Test
    void shouldUpdateCustomerName() {
        // Given
        Customer customer = Customer.create(
            "Original Name",
            new Email("test@example.com"),
            "+111",
            new Address("Street", "City", "ST", "11111", "Country")
        );
        
        String newName = "New Name";
        
        // When
        customer.updateName(newName);
        
        // Then
        assertEquals(newName, customer.getName());
    }
    
    @Test
    void shouldUpdateCustomerEmail() {
        // Given
        Customer customer = Customer.create(
            "Test User",
            new Email("old@example.com"),
            "+111",
            new Address("Street", "City", "ST", "11111", "Country")
        );
        
        Email newEmail = new Email("new@example.com");
        
        // When
        customer.updateEmail(newEmail);
        
        // Then
        assertEquals(newEmail, customer.getEmail());
    }
    
    @Test
    void shouldCompareCustomersByIdForEquality() {
        // Given
        CustomerId id = CustomerId.generate();
        Email email1 = new Email("test1@example.com");
        Email email2 = new Email("test2@example.com");
        Address address = new Address("Street", "City", "ST", "11111", "Country");
        
        Customer customer1 = new Customer(id, "Name 1", email1, "+111", address);
        Customer customer2 = new Customer(id, "Name 2", email2, "+222", address);
        
        // Then
        assertEquals(customer1, customer2);
        assertEquals(customer1.hashCode(), customer2.hashCode());
    }
}

