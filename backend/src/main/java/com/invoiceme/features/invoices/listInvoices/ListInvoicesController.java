package com.invoiceme.features.invoices.listInvoices;

import com.invoiceme.features.invoices.getInvoice.InvoiceDto;
import com.invoiceme.shared.pagination.PageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for listing invoices with filters
 * GET /api/invoices?status=SENT&customerId=123&page=0&size=20
 */
@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class ListInvoicesController {
    
    private final ListInvoicesHandler handler;
    
    public ListInvoicesController(ListInvoicesHandler handler) {
        this.handler = handler;
    }
    
    /**
     * List invoices with optional filters and pagination
     * 
     * @param status Filter by invoice status (DRAFT, SENT, PAID)
     * @param customerId Filter by customer ID
     * @param page Page number (0-indexed), defaults to null for no pagination
     * @param size Page size, defaults to 20
     * @param sortBy Field to sort by, defaults to "createdAt"
     * @param direction Sort direction (asc/desc), defaults to "desc"
     * @return List of invoices or paginated response
     */
    @GetMapping
    public ResponseEntity<?> listInvoices(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        ListInvoicesQuery query = new ListInvoicesQuery(status, customerId);
        
        // If page is specified, return paginated response
        if (page != null) {
            PageResponse<InvoiceDto> pageResponse = handler.handlePaginated(query, page, size, sortBy, direction);
            return ResponseEntity.ok(pageResponse);
        }
        
        // Otherwise, return all invoices (backward compatibility)
        List<InvoiceDto> invoices = handler.handle(query);
        return ResponseEntity.ok(invoices);
    }
}

