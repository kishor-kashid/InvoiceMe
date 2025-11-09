package com.invoiceme.features.invoices.updateInvoice;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for updating an invoice
 * PUT /api/invoices/{id}
 */
@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class UpdateInvoiceController {
    
    private final UpdateInvoiceHandler handler;
    
    public UpdateInvoiceController(UpdateInvoiceHandler handler) {
        this.handler = handler;
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateInvoice(
            @PathVariable String id,
            @Valid @RequestBody UpdateInvoiceDto dto) {
        
        UpdateInvoiceCommand command = new UpdateInvoiceCommand(
            id,
            dto.getIssueDate(),
            dto.getDueDate(),
            dto.getNotes()
        );
        
        handler.handle(command);
        
        return ResponseEntity.ok(Map.of("message", "Invoice updated successfully"));
    }
}

