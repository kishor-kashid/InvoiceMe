package com.invoiceme.features.invoices.createInvoice;

import java.time.LocalDate;
import java.util.List;

/**
 * Command to create a new invoice
 */
public class CreateInvoiceCommand {
    private final String customerId;
    private final String invoiceNumber;
    private final LocalDate issueDate;
    private final LocalDate dueDate;
    private final List<LineItemCommand> lineItems;
    private final String currency;
    private final String notes;
    
    public CreateInvoiceCommand(String customerId, String invoiceNumber, LocalDate issueDate,
                               LocalDate dueDate, List<LineItemCommand> lineItems,
                               String currency, String notes) {
        this.customerId = customerId;
        this.invoiceNumber = invoiceNumber;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.lineItems = lineItems;
        this.currency = currency;
        this.notes = notes;
    }
    
    public String getCustomerId() {
        return customerId;
    }
    
    public String getInvoiceNumber() {
        return invoiceNumber;
    }
    
    public LocalDate getIssueDate() {
        return issueDate;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public List<LineItemCommand> getLineItems() {
        return lineItems;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public static class LineItemCommand {
        private final String description;
        private final int quantity;
        private final Double unitPrice;
        
        public LineItemCommand(String description, int quantity, Double unitPrice) {
            this.description = description;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }
        
        public String getDescription() {
            return description;
        }
        
        public int getQuantity() {
            return quantity;
        }
        
        public Double getUnitPrice() {
            return unitPrice;
        }
    }
}

