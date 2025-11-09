package com.invoiceme.features.invoices.updateInvoice;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.invoice.InvoiceRepository;
import com.invoiceme.shared.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for updating an invoice
 * CQRS Command Handler
 */
@Service
public class UpdateInvoiceHandler {
    
    private final InvoiceRepository invoiceRepository;
    
    public UpdateInvoiceHandler(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
    
    @Transactional
    public void handle(UpdateInvoiceCommand command) {
        InvoiceId invoiceId = new InvoiceId(command.getInvoiceId());
        
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new NotFoundException("Invoice", command.getInvoiceId()));
        
        // Update invoice details (will throw exception if not in DRAFT status)
        invoice.updateDetails(
            command.getIssueDate(),
            command.getDueDate(),
            command.getNotes()
        );
        
        invoiceRepository.save(invoice);
    }
}

