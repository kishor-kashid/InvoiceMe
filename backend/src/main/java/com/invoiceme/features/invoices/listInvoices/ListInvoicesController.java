package com.invoiceme.features.invoices.listInvoices;

import com.invoiceme.features.invoices.getInvoice.InvoiceDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for listing invoices with filters
 * GET /api/invoices?status=SENT&customerId=123
 */
@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class ListInvoicesController {
    
    private final ListInvoicesHandler handler;
    
    public ListInvoicesController(ListInvoicesHandler handler) {
        this.handler = handler;
    }
    
    @GetMapping
    public ResponseEntity<List<InvoiceDto>> listInvoices(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String customerId) {
        
        ListInvoicesQuery query = new ListInvoicesQuery(status, customerId);
        List<InvoiceDto> invoices = handler.handle(query);
        return ResponseEntity.ok(invoices);
    }
}

