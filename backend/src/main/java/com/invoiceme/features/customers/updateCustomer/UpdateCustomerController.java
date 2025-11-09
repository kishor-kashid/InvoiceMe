package com.invoiceme.features.customers.updateCustomer;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for updating a customer
 * PUT /api/customers/{id}
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class UpdateCustomerController {
    
    private final UpdateCustomerHandler handler;
    
    public UpdateCustomerController(UpdateCustomerHandler handler) {
        this.handler = handler;
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateCustomer(
            @PathVariable String id,
            @Valid @RequestBody UpdateCustomerDto dto) {
        
        UpdateCustomerCommand command = new UpdateCustomerCommand(
            id,
            dto.getName(),
            dto.getEmail(),
            dto.getPhone(),
            dto.getStreet(),
            dto.getCity(),
            dto.getState(),
            dto.getZipCode(),
            dto.getCountry()
        );
        
        handler.handle(command);
        
        return ResponseEntity.ok(Map.of("message", "Customer updated successfully"));
    }
}

