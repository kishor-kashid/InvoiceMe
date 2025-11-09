package com.invoiceme.features.payments.getPayment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for getting a payment by ID
 * GET /api/payments/{id}
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class GetPaymentController {
    
    private final GetPaymentHandler handler;
    
    public GetPaymentController(GetPaymentHandler handler) {
        this.handler = handler;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getPayment(@PathVariable String id) {
        GetPaymentQuery query = new GetPaymentQuery(id);
        PaymentDto payment = handler.handle(query);
        return ResponseEntity.ok(payment);
    }
}

