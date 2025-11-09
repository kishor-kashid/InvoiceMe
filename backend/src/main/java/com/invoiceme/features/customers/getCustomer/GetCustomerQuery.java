package com.invoiceme.features.customers.getCustomer;

/**
 * Query to get a customer by ID
 */
public class GetCustomerQuery {
    private final String customerId;
    
    public GetCustomerQuery(String customerId) {
        this.customerId = customerId;
    }
    
    public String getCustomerId() {
        return customerId;
    }
}

