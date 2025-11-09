package com.invoiceme.features.invoices.createInvoice;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO for creating a new invoice
 */
public class CreateInvoiceDto {
    
    @NotBlank(message = "Customer ID is required")
    private String customerId;
    
    @NotBlank(message = "Invoice number is required")
    private String invoiceNumber;
    
    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;
    
    @NotNull(message = "Due date is required")
    private LocalDate dueDate;
    
    @NotEmpty(message = "At least one line item is required")
    @Valid
    private List<LineItemDto> lineItems;
    
    @NotBlank(message = "Currency is required")
    private String currency;
    
    private String notes;
    
    /**
     * Validates that due date is after or equal to issue date
     */
    @AssertTrue(message = "Due date must be after or equal to issue date")
    private boolean isValidDateRange() {
        if (issueDate == null || dueDate == null) {
            return true; // Let @NotNull handle null checks
        }
        return !dueDate.isBefore(issueDate);
    }
    
    // Constructors
    public CreateInvoiceDto() {
    }
    
    // Getters and Setters
    public String getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
    
    public String getInvoiceNumber() {
        return invoiceNumber;
    }
    
    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }
    
    public LocalDate getIssueDate() {
        return issueDate;
    }
    
    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public List<LineItemDto> getLineItems() {
        return lineItems;
    }
    
    public void setLineItems(List<LineItemDto> lineItems) {
        this.lineItems = lineItems;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    // Nested LineItem DTO
    public static class LineItemDto {
        @NotBlank(message = "Line item description is required")
        private String description;
        
        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be greater than zero")
        private Integer quantity;
        
        @NotNull(message = "Unit price is required")
        @Positive(message = "Unit price must be greater than zero")
        private Double unitPrice;
        
        public LineItemDto() {
        }
        
        public LineItemDto(String description, Integer quantity, Double unitPrice) {
            this.description = description;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public Integer getQuantity() {
            return quantity;
        }
        
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        
        public Double getUnitPrice() {
            return unitPrice;
        }
        
        public void setUnitPrice(Double unitPrice) {
            this.unitPrice = unitPrice;
        }
    }
}

