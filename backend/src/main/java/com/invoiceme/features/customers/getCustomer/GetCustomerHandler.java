package com.invoiceme.features.customers.getCustomer;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.customer.CustomerRepository;
import com.invoiceme.shared.exceptions.NotFoundException;
import com.invoiceme.shared.mapper.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for getting a customer by ID
 * CQRS Query Handler
 */
@Service
@Transactional(readOnly = true)
public class GetCustomerHandler {
    
    private final CustomerRepository customerRepository;
    private final DtoMapper dtoMapper;
    
    public GetCustomerHandler(CustomerRepository customerRepository, DtoMapper dtoMapper) {
        this.customerRepository = customerRepository;
        this.dtoMapper = dtoMapper;
    }
    
    public CustomerDto handle(GetCustomerQuery query) {
        CustomerId customerId = new CustomerId(query.getCustomerId());
        
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new NotFoundException("Customer", query.getCustomerId()));
        
        return dtoMapper.toCustomerDto(customer);
    }
}

