package com.invoiceme.features.customers.deleteCustomer;

/**
 * Command to delete a customer
 */
public class DeleteCustomerCommand {
    private final String customerId;
    
    public DeleteCustomerCommand(String customerId) {
        this.customerId = customerId;
    }
    
    public String getCustomerId() {
        return customerId;
    }
}

