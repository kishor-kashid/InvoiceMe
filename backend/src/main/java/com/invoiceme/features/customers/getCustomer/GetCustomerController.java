package com.invoiceme.features.customers.getCustomer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for getting a customer by ID
 * GET /api/customers/{id}
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class GetCustomerController {
    
    private final GetCustomerHandler handler;
    
    public GetCustomerController(GetCustomerHandler handler) {
        this.handler = handler;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomer(@PathVariable String id) {
        GetCustomerQuery query = new GetCustomerQuery(id);
        CustomerDto customer = handler.handle(query);
        return ResponseEntity.ok(customer);
    }
}

