package com.invoiceme.features;

import com.invoiceme.features.customers.createCustomer.CreateCustomerDto;
import com.invoiceme.features.invoices.createInvoice.CreateInvoiceDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for validation annotations on DTOs
 */
class ValidationTest {
    
    private static Validator validator;
    
    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }
    
    @Test
    void testCreateCustomerDto_ValidData() {
        CreateCustomerDto dto = new CreateCustomerDto(
            "John Doe",
            "john@example.com",
            "+1-555-0100",
            "123 Main St",
            "New York",
            "NY",
            "10001",
            "USA"
        );
        
        Set<ConstraintViolation<CreateCustomerDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Valid DTO should have no violations");
    }
    
    @Test
    void testCreateCustomerDto_InvalidEmail() {
        CreateCustomerDto dto = new CreateCustomerDto(
            "John Doe",
            "invalid-email",
            "+1-555-0100",
            "123 Main St",
            "New York",
            "NY",
            "10001",
            "USA"
        );
        
        Set<ConstraintViolation<CreateCustomerDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Invalid email should cause validation error");
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("email")));
    }
    
    @Test
    void testCreateCustomerDto_MissingRequiredFields() {
        CreateCustomerDto dto = new CreateCustomerDto();
        // Leave all fields null/empty
        
        Set<ConstraintViolation<CreateCustomerDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Missing required fields should cause validation errors");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("name")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }
    
    @Test
    void testCreateInvoiceDto_ValidData() {
        CreateInvoiceDto.LineItemDto lineItem = new CreateInvoiceDto.LineItemDto(
            "Service 1",
            2,
            100.0
        );
        
        List<CreateInvoiceDto.LineItemDto> lineItems = new ArrayList<>();
        lineItems.add(lineItem);
        
        CreateInvoiceDto dto = new CreateInvoiceDto();
        dto.setCustomerId("customer-id");
        dto.setInvoiceNumber("INV-001");
        dto.setIssueDate(LocalDate.now());
        dto.setDueDate(LocalDate.now().plusDays(30));
        dto.setLineItems(lineItems);
        dto.setCurrency("USD");
        
        Set<ConstraintViolation<CreateInvoiceDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Valid invoice DTO should have no violations");
    }
    
    @Test
    void testCreateInvoiceDto_DueDateBeforeIssueDate() {
        CreateInvoiceDto.LineItemDto lineItem = new CreateInvoiceDto.LineItemDto(
            "Service 1",
            2,
            100.0
        );
        
        List<CreateInvoiceDto.LineItemDto> lineItems = new ArrayList<>();
        lineItems.add(lineItem);
        
        CreateInvoiceDto dto = new CreateInvoiceDto();
        dto.setCustomerId("customer-id");
        dto.setInvoiceNumber("INV-001");
        dto.setIssueDate(LocalDate.now());
        dto.setDueDate(LocalDate.now().minusDays(1)); // Due date before issue date
        dto.setLineItems(lineItems);
        dto.setCurrency("USD");
        
        Set<ConstraintViolation<CreateInvoiceDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Due date before issue date should cause validation error");
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Due date must be after")));
    }
    
    @Test
    void testCreateInvoiceDto_EmptyLineItems() {
        CreateInvoiceDto dto = new CreateInvoiceDto();
        dto.setCustomerId("customer-id");
        dto.setInvoiceNumber("INV-001");
        dto.setIssueDate(LocalDate.now());
        dto.setDueDate(LocalDate.now().plusDays(30));
        dto.setLineItems(new ArrayList<>()); // Empty list
        dto.setCurrency("USD");
        
        Set<ConstraintViolation<CreateInvoiceDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Empty line items should cause validation error");
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("At least one line item")));
    }
    
    @Test
    void testCreateInvoiceDto_InvalidLineItem() {
        CreateInvoiceDto.LineItemDto lineItem = new CreateInvoiceDto.LineItemDto(
            "", // Empty description
            -1, // Negative quantity
            null // Null unit price
        );
        
        List<CreateInvoiceDto.LineItemDto> lineItems = new ArrayList<>();
        lineItems.add(lineItem);
        
        CreateInvoiceDto dto = new CreateInvoiceDto();
        dto.setCustomerId("customer-id");
        dto.setInvoiceNumber("INV-001");
        dto.setIssueDate(LocalDate.now());
        dto.setDueDate(LocalDate.now().plusDays(30));
        dto.setLineItems(lineItems);
        dto.setCurrency("USD");
        
        Set<ConstraintViolation<CreateInvoiceDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Invalid line item should cause validation errors");
    }
}

