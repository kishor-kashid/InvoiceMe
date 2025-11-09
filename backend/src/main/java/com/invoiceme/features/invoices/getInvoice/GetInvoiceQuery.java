package com.invoiceme.features.invoices.getInvoice;

/**
 * Query to get an invoice by ID
 */
public class GetInvoiceQuery {
    private final String invoiceId;
    
    public GetInvoiceQuery(String invoiceId) {
        this.invoiceId = invoiceId;
    }
    
    public String getInvoiceId() {
        return invoiceId;
    }
}

