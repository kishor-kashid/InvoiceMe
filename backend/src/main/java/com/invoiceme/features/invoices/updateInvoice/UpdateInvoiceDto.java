package com.invoiceme.features.invoices.updateInvoice;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * DTO for updating an invoice (only in DRAFT status)
 */
public class UpdateInvoiceDto {
    
    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;
    
    @NotNull(message = "Due date is required")
    private LocalDate dueDate;
    
    private String notes;
    
    // Constructors
    public UpdateInvoiceDto() {
    }
    
    // Getters and Setters
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
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}

