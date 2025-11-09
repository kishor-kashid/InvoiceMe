package com.invoiceme.features.customers.createCustomer;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.customer.CustomerRepository;
import com.invoiceme.domain.shared.Address;
import com.invoiceme.domain.shared.Email;
import com.invoiceme.shared.exceptions.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for creating a new customer
 * CQRS Command Handler
 */
@Service
public class CreateCustomerHandler {
    
    private final CustomerRepository customerRepository;
    
    public CreateCustomerHandler(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    
    @Transactional
    public String handle(CreateCustomerCommand command) {
        // Check if email already exists
        Email email = new Email(command.getEmail());
        if (customerRepository.existsByEmail(email)) {
            throw new BusinessException("Customer with email " + command.getEmail() + " already exists");
        }
        
        // Create address
        Address address = new Address(
            command.getStreet(),
            command.getCity(),
            command.getState(),
            command.getZipCode(),
            command.getCountry()
        );
        
        // Create customer
        Customer customer = Customer.create(
            command.getName(),
            email,
            command.getPhone(),
            address
        );
        
        // Save customer
        Customer savedCustomer = customerRepository.save(customer);
        
        return savedCustomer.getId().getId();
    }
}

