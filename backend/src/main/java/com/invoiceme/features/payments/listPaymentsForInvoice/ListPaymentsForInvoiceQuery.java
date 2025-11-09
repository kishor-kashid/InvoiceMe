package com.invoiceme.features.payments.listPaymentsForInvoice;

/**
 * Query to list all payments for a specific invoice
 */
public class ListPaymentsForInvoiceQuery {
    private final String invoiceId;
    
    public ListPaymentsForInvoiceQuery(String invoiceId) {
        this.invoiceId = invoiceId;
    }
    
    public String getInvoiceId() {
        return invoiceId;
    }
}

