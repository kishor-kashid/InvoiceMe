package com.invoiceme.features.invoices.getInvoice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for getting an invoice by ID
 * GET /api/invoices/{id}
 */
@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class GetInvoiceController {
    
    private final GetInvoiceHandler handler;
    
    public GetInvoiceController(GetInvoiceHandler handler) {
        this.handler = handler;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDto> getInvoice(@PathVariable String id) {
        GetInvoiceQuery query = new GetInvoiceQuery(id);
        InvoiceDto invoice = handler.handle(query);
        return ResponseEntity.ok(invoice);
    }
}

