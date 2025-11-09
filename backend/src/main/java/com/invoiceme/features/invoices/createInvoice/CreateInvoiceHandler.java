package com.invoiceme.features.invoices.createInvoice;

import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.customer.CustomerRepository;
import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceRepository;
import com.invoiceme.domain.invoice.LineItem;
import com.invoiceme.domain.shared.Money;
import com.invoiceme.shared.exceptions.BusinessException;
import com.invoiceme.shared.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for creating a new invoice
 * CQRS Command Handler
 */
@Service
public class CreateInvoiceHandler {
    
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    
    public CreateInvoiceHandler(InvoiceRepository invoiceRepository, 
                               CustomerRepository customerRepository) {
        this.invoiceRepository = invoiceRepository;
        this.customerRepository = customerRepository;
    }
    
    @Transactional
    public String handle(CreateInvoiceCommand command) {
        // Verify customer exists
        CustomerId customerId = new CustomerId(command.getCustomerId());
        if (!customerRepository.existsById(customerId)) {
            throw new NotFoundException("Customer", command.getCustomerId());
        }
        
        // Check if invoice number already exists
        if (invoiceRepository.existsByInvoiceNumber(command.getInvoiceNumber())) {
            throw new BusinessException("Invoice number " + command.getInvoiceNumber() + " already exists");
        }
        
        // Create invoice
        Invoice invoice = Invoice.create(
            customerId,
            command.getInvoiceNumber(),
            command.getIssueDate(),
            command.getDueDate(),
            command.getCurrency()
        );
        
        // Add line items
        for (CreateInvoiceCommand.LineItemCommand lineItemCmd : command.getLineItems()) {
            LineItem lineItem = new LineItem(
                lineItemCmd.getDescription(),
                lineItemCmd.getQuantity(),
                new Money(lineItemCmd.getUnitPrice(), command.getCurrency())
            );
            invoice.addLineItem(lineItem);
        }
        
        // Set notes if provided
        if (command.getNotes() != null && !command.getNotes().isBlank()) {
            invoice.updateDetails(command.getIssueDate(), command.getDueDate(), command.getNotes());
        }
        
        // Save invoice
        Invoice savedInvoice = invoiceRepository.save(invoice);
        
        return savedInvoice.getId().getId();
    }
}

