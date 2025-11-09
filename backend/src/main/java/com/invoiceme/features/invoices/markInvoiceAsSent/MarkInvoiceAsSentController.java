package com.invoiceme.features.invoices.markInvoiceAsSent;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for marking an invoice as sent
 * POST /api/invoices/{id}/send
 */
@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class MarkInvoiceAsSentController {
    
    private final MarkInvoiceAsSentHandler handler;
    
    public MarkInvoiceAsSentController(MarkInvoiceAsSentHandler handler) {
        this.handler = handler;
    }
    
    @PostMapping("/{id}/send")
    public ResponseEntity<Map<String, String>> markInvoiceAsSent(@PathVariable String id) {
        MarkInvoiceAsSentCommand command = new MarkInvoiceAsSentCommand(id);
        handler.handle(command);
        return ResponseEntity.ok(Map.of("message", "Invoice marked as sent"));
    }
}

