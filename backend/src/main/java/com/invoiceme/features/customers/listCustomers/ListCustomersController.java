package com.invoiceme.features.customers.listCustomers;

import com.invoiceme.features.customers.getCustomer.CustomerDto;
import com.invoiceme.shared.pagination.PageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for listing all customers
 * GET /api/customers
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class ListCustomersController {
    
    private final ListCustomersHandler handler;
    
    public ListCustomersController(ListCustomersHandler handler) {
        this.handler = handler;
    }
    
    /**
     * List customers with optional pagination
     * 
     * @param page Page number (0-indexed), defaults to null for no pagination
     * @param size Page size, defaults to 20
     * @param sortBy Field to sort by, defaults to "createdAt"
     * @param direction Sort direction (asc/desc), defaults to "desc"
     * @return List of customers or paginated response
     */
    @GetMapping
    public ResponseEntity<?> listCustomers(
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        ListCustomersQuery query = new ListCustomersQuery();
        
        // If page is specified, return paginated response
        if (page != null) {
            PageResponse<CustomerDto> pageResponse = handler.handlePaginated(query, page, size, sortBy, direction);
            return ResponseEntity.ok(pageResponse);
        }
        
        // Otherwise, return all customers (backward compatibility)
        List<CustomerDto> customers = handler.handle(query);
        return ResponseEntity.ok(customers);
    }
}

