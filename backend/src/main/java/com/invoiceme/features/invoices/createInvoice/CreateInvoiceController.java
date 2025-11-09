package com.invoiceme.features.invoices.createInvoice;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST controller for creating invoices
 * POST /api/invoices
 */
@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class CreateInvoiceController {
    
    private final CreateInvoiceHandler handler;
    
    public CreateInvoiceController(CreateInvoiceHandler handler) {
        this.handler = handler;
    }
    
    @PostMapping
    public ResponseEntity<Map<String, String>> createInvoice(@Valid @RequestBody CreateInvoiceDto dto) {
        CreateInvoiceCommand command = new CreateInvoiceCommand(
            dto.getCustomerId(),
            dto.getInvoiceNumber(),
            dto.getIssueDate(),
            dto.getDueDate(),
            dto.getLineItems().stream()
                .map(item -> new CreateInvoiceCommand.LineItemCommand(
                    item.getDescription(),
                    item.getQuantity(),
                    item.getUnitPrice()
                ))
                .collect(Collectors.toList()),
            dto.getCurrency(),
            dto.getNotes()
        );
        
        String invoiceId = handler.handle(command);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(Map.of("id", invoiceId, "message", "Invoice created successfully"));
    }
}

