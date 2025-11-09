package com.invoiceme.features.customers.updateCustomer;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.customer.CustomerRepository;
import com.invoiceme.domain.shared.Address;
import com.invoiceme.domain.shared.Email;
import com.invoiceme.shared.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for updating a customer
 * CQRS Command Handler
 */
@Service
public class UpdateCustomerHandler {
    
    private final CustomerRepository customerRepository;
    
    public UpdateCustomerHandler(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    
    @Transactional
    public void handle(UpdateCustomerCommand command) {
        CustomerId customerId = new CustomerId(command.getCustomerId());
        
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new NotFoundException("Customer", command.getCustomerId()));
        
        // Update customer details
        Email email = new Email(command.getEmail());
        Address address = new Address(
            command.getStreet(),
            command.getCity(),
            command.getState(),
            command.getZipCode(),
            command.getCountry()
        );
        
        customer.updateDetails(
            command.getName(),
            email,
            command.getPhone(),
            address
        );
        
        customerRepository.save(customer);
    }
}

