package com.invoiceme.features.payments.listAllPayments;

import com.invoiceme.features.payments.getPayment.PaymentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for listing all payments
 * GET /api/payments
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class ListAllPaymentsController {
    
    private final ListAllPaymentsHandler handler;
    
    public ListAllPaymentsController(ListAllPaymentsHandler handler) {
        this.handler = handler;
    }
    
    @GetMapping
    public ResponseEntity<List<PaymentDto>> listAllPayments() {
        ListAllPaymentsQuery query = new ListAllPaymentsQuery();
        List<PaymentDto> payments = handler.handle(query);
        return ResponseEntity.ok(payments);
    }
}

