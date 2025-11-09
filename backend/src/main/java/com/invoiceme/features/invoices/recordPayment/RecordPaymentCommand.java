package com.invoiceme.features.invoices.recordPayment;

import java.time.LocalDateTime;

/**
 * Command to record a payment against an invoice
 */
public class RecordPaymentCommand {
    private final String invoiceId;
    private final Double amount;
    private final LocalDateTime paymentDate;
    private final String paymentMethod;
    private final String referenceNumber;
    private final String notes;
    
    public RecordPaymentCommand(String invoiceId, Double amount, LocalDateTime paymentDate,
                               String paymentMethod, String referenceNumber, String notes) {
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.referenceNumber = referenceNumber;
        this.notes = notes;
    }
    
    public String getInvoiceId() {
        return invoiceId;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public String getReferenceNumber() {
        return referenceNumber;
    }
    
    public String getNotes() {
        return notes;
    }
}

