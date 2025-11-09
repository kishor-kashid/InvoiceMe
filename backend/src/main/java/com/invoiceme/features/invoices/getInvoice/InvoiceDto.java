package com.invoiceme.features.invoices.getInvoice;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for invoice read model
 */
public class InvoiceDto {
    private String id;
    private String customerId;
    private String invoiceNumber;
    private String status;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private List<LineItemDto> lineItems;
    private MoneyDto totalAmount;
    private MoneyDto paidAmount;
    private MoneyDto balance;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime sentAt;
    
    public InvoiceDto() {
    }
    
    public InvoiceDto(String id, String customerId, String invoiceNumber, String status,
                     LocalDate issueDate, LocalDate dueDate, List<LineItemDto> lineItems,
                     MoneyDto totalAmount, MoneyDto paidAmount, MoneyDto balance,
                     String notes, LocalDateTime createdAt, LocalDateTime updatedAt,
                     LocalDateTime sentAt) {
        this.id = id;
        this.customerId = customerId;
        this.invoiceNumber = invoiceNumber;
        this.status = status;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.lineItems = lineItems;
        this.totalAmount = totalAmount;
        this.paidAmount = paidAmount;
        this.balance = balance;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.sentAt = sentAt;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
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
    
    public MoneyDto getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(MoneyDto totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public MoneyDto getPaidAmount() {
        return paidAmount;
    }
    
    public void setPaidAmount(MoneyDto paidAmount) {
        this.paidAmount = paidAmount;
    }
    
    public MoneyDto getBalance() {
        return balance;
    }
    
    public void setBalance(MoneyDto balance) {
        this.balance = balance;
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
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public LocalDateTime getSentAt() {
        return sentAt;
    }
    
    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
    
    // Nested Money DTO
    public static class MoneyDto {
        private Double amount;
        private String currency;
        
        public MoneyDto() {
        }
        
        public MoneyDto(Double amount, String currency) {
            this.amount = amount;
            this.currency = currency;
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
    }
}

