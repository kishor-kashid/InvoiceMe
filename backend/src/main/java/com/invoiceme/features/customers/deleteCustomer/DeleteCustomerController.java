package com.invoiceme.features.customers.deleteCustomer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for deleting a customer
 * DELETE /api/customers/{id}
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class DeleteCustomerController {
    
    private final DeleteCustomerHandler handler;
    
    public DeleteCustomerController(DeleteCustomerHandler handler) {
        this.handler = handler;
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCustomer(@PathVariable String id) {
        DeleteCustomerCommand command = new DeleteCustomerCommand(id);
        handler.handle(command);
        return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
    }
}

