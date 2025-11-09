package com.invoiceme.features.invoices.updateInvoice;

import jakarta.validation.constraints.AssertTrue;
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

