package com.invoiceme.features.customers.listCustomers;

import com.invoiceme.features.customers.getCustomer.CustomerDto;
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
    
    @GetMapping
    public ResponseEntity<List<CustomerDto>> listCustomers() {
        ListCustomersQuery query = new ListCustomersQuery();
        List<CustomerDto> customers = handler.handle(query);
        return ResponseEntity.ok(customers);
    }
}

