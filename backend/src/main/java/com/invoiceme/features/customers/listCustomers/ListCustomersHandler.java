package com.invoiceme.features.customers.listCustomers;

import com.invoiceme.domain.customer.CustomerRepository;
import com.invoiceme.features.customers.getCustomer.CustomerDto;
import com.invoiceme.shared.mapper.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Handler for listing all customers
 * CQRS Query Handler
 */
@Service
@Transactional(readOnly = true)
public class ListCustomersHandler {
    
    private final CustomerRepository customerRepository;
    private final DtoMapper dtoMapper;
    
    public ListCustomersHandler(CustomerRepository customerRepository, DtoMapper dtoMapper) {
        this.customerRepository = customerRepository;
        this.dtoMapper = dtoMapper;
    }
    
    public List<CustomerDto> handle(ListCustomersQuery query) {
        return customerRepository.findAll().stream()
            .map(dtoMapper::toCustomerDto)
            .collect(Collectors.toList());
    }
}

