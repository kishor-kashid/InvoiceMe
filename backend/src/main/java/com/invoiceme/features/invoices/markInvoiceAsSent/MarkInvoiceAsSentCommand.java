package com.invoiceme.features.invoices.markInvoiceAsSent;

/**
 * Command to mark an invoice as sent
 */
public class MarkInvoiceAsSentCommand {
    private final String invoiceId;
    
    public MarkInvoiceAsSentCommand(String invoiceId) {
        this.invoiceId = invoiceId;
    }
    
    public String getInvoiceId() {
        return invoiceId;
    }
}

