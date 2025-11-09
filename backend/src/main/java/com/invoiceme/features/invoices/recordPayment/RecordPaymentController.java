package com.invoiceme.features.invoices.recordPayment;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for recording payments
 * POST /api/invoices/{id}/payments
 */
@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class RecordPaymentController {
    
    private final RecordPaymentHandler handler;
    
    public RecordPaymentController(RecordPaymentHandler handler) {
        this.handler = handler;
    }
    
    @PostMapping("/{id}/payments")
    public ResponseEntity<Map<String, String>> recordPayment(
            @PathVariable String id,
            @Valid @RequestBody RecordPaymentDto dto) {
        
        RecordPaymentCommand command = new RecordPaymentCommand(
            id,
            dto.getAmount(),
            dto.getPaymentDate(),
            dto.getPaymentMethod(),
            dto.getReferenceNumber(),
            dto.getNotes()
        );
        
        String paymentId = handler.handle(command);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(Map.of(
                "paymentId", paymentId,
                "message", "Payment recorded successfully"
            ));
    }
}

