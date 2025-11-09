package com.invoiceme.features.invoices.recordPayment;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.invoice.InvoiceRepository;
import com.invoiceme.domain.payment.Payment;
import com.invoiceme.domain.payment.PaymentRepository;
import com.invoiceme.domain.shared.Money;
import com.invoiceme.shared.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Handler for recording a payment against an invoice
 * CQRS Command Handler
 */
@Service
public class RecordPaymentHandler {
    
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    
    public RecordPaymentHandler(InvoiceRepository invoiceRepository, 
                               PaymentRepository paymentRepository) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
    }
    
    @Transactional
    public String handle(RecordPaymentCommand command) {
        InvoiceId invoiceId = new InvoiceId(command.getInvoiceId());
        
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new NotFoundException("Invoice", command.getInvoiceId()));
        
        // Get currency from invoice
        String currency = invoice.getTotalAmount().getCurrency();
        Money paymentAmount = new Money(command.getAmount(), currency);
        
        // Apply payment to invoice (will validate amount and status)
        invoice.applyPayment(paymentAmount);
        
        // Create payment record
        LocalDateTime paymentDate = command.getPaymentDate() != null 
            ? command.getPaymentDate() 
            : LocalDateTime.now();
            
        Payment payment = Payment.create(
            invoiceId,
            paymentAmount,
            paymentDate,
            command.getPaymentMethod(),
            command.getReferenceNumber(),
            command.getNotes()
        );
        
        // Save both invoice and payment
        invoiceRepository.save(invoice);
        Payment savedPayment = paymentRepository.save(payment);
        
        return savedPayment.getId().getId();
    }
}

