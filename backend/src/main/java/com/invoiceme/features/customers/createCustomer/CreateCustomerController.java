package com.invoiceme.features.customers.createCustomer;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for creating customers
 * POST /api/customers
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CreateCustomerController {
    
    private final CreateCustomerHandler handler;
    
    public CreateCustomerController(CreateCustomerHandler handler) {
        this.handler = handler;
    }
    
    @PostMapping
    public ResponseEntity<Map<String, String>> createCustomer(@Valid @RequestBody CreateCustomerDto dto) {
        CreateCustomerCommand command = new CreateCustomerCommand(
            dto.getName(),
            dto.getEmail(),
            dto.getPhone(),
            dto.getStreet(),
            dto.getCity(),
            dto.getState(),
            dto.getZipCode(),
            dto.getCountry()
        );
        
        String customerId = handler.handle(command);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(Map.of("id", customerId, "message", "Customer created successfully"));
    }
}

