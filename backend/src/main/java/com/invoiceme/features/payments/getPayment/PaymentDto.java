package com.invoiceme.features.payments.getPayment;

import java.time.LocalDateTime;

/**
 * DTO for payment read model
 */
public class PaymentDto {
    private String id;
    private String invoiceId;
    private Double amount;
    private String currency;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String referenceNumber;
    private String notes;
    private LocalDateTime createdAt;
    
    public PaymentDto() {
    }
    
    public PaymentDto(String id, String invoiceId, Double amount, String currency,
                     LocalDateTime paymentDate, String paymentMethod,
                     String referenceNumber, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.currency = currency;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.referenceNumber = referenceNumber;
        this.notes = notes;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getInvoiceId() {
        return invoiceId;
    }
    
    public void setInvoiceId(String invoiceId) {
        this.invoiceId = invoiceId;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

