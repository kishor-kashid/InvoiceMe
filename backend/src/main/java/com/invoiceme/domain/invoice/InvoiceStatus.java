package com.invoiceme.domain.invoice;

/**
 * Enum representing the lifecycle states of an Invoice
 * Lifecycle: DRAFT → SENT → PAID
 */
public enum InvoiceStatus {
    /**
     * Invoice is in draft state and can be edited
     */
    DRAFT,
    
    /**
     * Invoice has been sent to customer
     */
    SENT,
    
    /**
     * Invoice has been fully paid
     */
    PAID;
    
    /**
     * Check if the invoice is in draft state
     */
    public boolean isDraft() {
        return this == DRAFT;
    }
    
    /**
     * Check if the invoice has been sent
     */
    public boolean isSent() {
        return this == SENT;
    }
    
    /**
     * Check if the invoice is paid
     */
    public boolean isPaid() {
        return this == PAID;
    }
    
    /**
     * Check if the invoice can be edited
     */
    public boolean canBeEdited() {
        return this == DRAFT;
    }
    
    /**
     * Check if payments can be recorded against this invoice
     */
    public boolean canAcceptPayments() {
        return this == SENT;
    }
}

