package com.invoiceme.features.customers.listCustomers;

import com.invoiceme.domain.customer.CustomerRepository;
import com.invoiceme.features.customers.getCustomer.CustomerDto;
import com.invoiceme.shared.mapper.DtoMapper;
import com.invoiceme.shared.pagination.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    
    /**
     * Handle list customers query without pagination (backward compatibility)
     */
    public List<CustomerDto> handle(ListCustomersQuery query) {
        return customerRepository.findAll().stream()
            .map(dtoMapper::toCustomerDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Handle list customers query with pagination
     */
    public PageResponse<CustomerDto> handlePaginated(ListCustomersQuery query, int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<CustomerDto> customerPage = customerRepository.findAll(pageable)
            .map(dtoMapper::toCustomerDto);
        
        return PageResponse.of(customerPage);
    }
}

