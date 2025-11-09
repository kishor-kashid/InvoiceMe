package com.invoiceme.features.invoices.updateInvoice;

import java.time.LocalDate;

/**
 * Command to update an invoice (only in DRAFT status)
 */
public class UpdateInvoiceCommand {
    private final String invoiceId;
    private final LocalDate issueDate;
    private final LocalDate dueDate;
    private final String notes;
    
    public UpdateInvoiceCommand(String invoiceId, LocalDate issueDate, 
                               LocalDate dueDate, String notes) {
        this.invoiceId = invoiceId;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.notes = notes;
    }
    
    public String getInvoiceId() {
        return invoiceId;
    }
    
    public LocalDate getIssueDate() {
        return issueDate;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public String getNotes() {
        return notes;
    }
}

