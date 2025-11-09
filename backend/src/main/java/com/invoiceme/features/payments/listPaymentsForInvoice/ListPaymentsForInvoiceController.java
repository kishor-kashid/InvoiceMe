package com.invoiceme.features.payments.listPaymentsForInvoice;

import com.invoiceme.features.payments.getPayment.PaymentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for listing payments for an invoice
 * GET /api/invoices/{id}/payments
 */
@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class ListPaymentsForInvoiceController {
    
    private final ListPaymentsForInvoiceHandler handler;
    
    public ListPaymentsForInvoiceController(ListPaymentsForInvoiceHandler handler) {
        this.handler = handler;
    }
    
    @GetMapping("/{id}/payments")
    public ResponseEntity<List<PaymentDto>> listPaymentsForInvoice(@PathVariable String id) {
        ListPaymentsForInvoiceQuery query = new ListPaymentsForInvoiceQuery(id);
        List<PaymentDto> payments = handler.handle(query);
        return ResponseEntity.ok(payments);
    }
}

