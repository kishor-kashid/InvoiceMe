package com.invoiceme.features.invoices.markInvoiceAsSent;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.invoice.InvoiceRepository;
import com.invoiceme.shared.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for marking an invoice as sent
 * CQRS Command Handler
 */
@Service
public class MarkInvoiceAsSentHandler {
    
    private final InvoiceRepository invoiceRepository;
    
    public MarkInvoiceAsSentHandler(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
    
    @Transactional
    public void handle(MarkInvoiceAsSentCommand command) {
        InvoiceId invoiceId = new InvoiceId(command.getInvoiceId());
        
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new NotFoundException("Invoice", command.getInvoiceId()));
        
        // Mark as sent (will throw exception if not in DRAFT status or has no line items)
        invoice.markAsSent();
        
        invoiceRepository.save(invoice);
    }
}

