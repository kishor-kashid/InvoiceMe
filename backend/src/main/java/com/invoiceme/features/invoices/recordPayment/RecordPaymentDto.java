package com.invoiceme.features.invoices.recordPayment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

/**
 * DTO for recording a payment against an invoice
 */
public class RecordPaymentDto {
    
    @NotNull(message = "Payment amount is required")
    @Positive(message = "Payment amount must be greater than zero")
    private Double amount;
    
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String referenceNumber;
    private String notes;
    
    // Constructors
    public RecordPaymentDto() {
    }
    
    // Getters and Setters
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getReferenceNumber() {
        return referenceNumber;
    }
    
    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}

