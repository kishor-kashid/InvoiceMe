package com.invoiceme.features.invoices.listInvoices;

/**
 * Query to list invoices with optional filters
 */
public class ListInvoicesQuery {
    private final String status;
    private final String customerId;
    
    public ListInvoicesQuery(String status, String customerId) {
        this.status = status;
        this.customerId = customerId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public String getCustomerId() {
        return customerId;
    }
}

