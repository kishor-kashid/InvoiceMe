package com.invoiceme.features.customers.deleteCustomer;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.customer.CustomerRepository;
import com.invoiceme.domain.invoice.InvoiceRepository;
import com.invoiceme.shared.exceptions.BusinessException;
import com.invoiceme.shared.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for deleting a customer
 * CQRS Command Handler
 */
@Service
public class DeleteCustomerHandler {
    
    private final CustomerRepository customerRepository;
    private final InvoiceRepository invoiceRepository;
    
    public DeleteCustomerHandler(CustomerRepository customerRepository, 
                                InvoiceRepository invoiceRepository) {
        this.customerRepository = customerRepository;
        this.invoiceRepository = invoiceRepository;
    }
    
    @Transactional
    public void handle(DeleteCustomerCommand command) {
        CustomerId customerId = new CustomerId(command.getCustomerId());
        
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new NotFoundException("Customer", command.getCustomerId()));
        
        // Check if customer has any invoices
        if (!invoiceRepository.findByCustomerId(customerId).isEmpty()) {
            throw new BusinessException("Cannot delete customer with existing invoices");
        }
        
        customerRepository.delete(customer);
    }
}

