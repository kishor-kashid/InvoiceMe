package com.invoiceme.features.payments.listAllPayments;

import com.invoiceme.features.payments.getPayment.PaymentDto;
import com.invoiceme.shared.pagination.PageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for listing all payments
 * GET /api/payments?page=0&size=20
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class ListAllPaymentsController {
    
    private final ListAllPaymentsHandler handler;
    
    public ListAllPaymentsController(ListAllPaymentsHandler handler) {
        this.handler = handler;
    }
    
    /**
     * List all payments with optional pagination
     * 
     * @param page Page number (0-indexed), defaults to null for no pagination
     * @param size Page size, defaults to 20
     * @param sortBy Field to sort by, defaults to "paymentDate"
     * @param direction Sort direction (asc/desc), defaults to "desc"
     * @return List of payments or paginated response
     */
    @GetMapping
    public ResponseEntity<?> listAllPayments(
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "paymentDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        ListAllPaymentsQuery query = new ListAllPaymentsQuery();
        
        // If page is specified, return paginated response
        if (page != null) {
            PageResponse<PaymentDto> pageResponse = handler.handlePaginated(query, page, size, sortBy, direction);
            return ResponseEntity.ok(pageResponse);
        }
        
        // Otherwise, return all payments (backward compatibility)
        List<PaymentDto> payments = handler.handle(query);
        return ResponseEntity.ok(payments);
    }
}

