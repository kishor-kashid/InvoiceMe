package com.invoiceme.features.invoices.listInvoices;

import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceRepository;
import com.invoiceme.domain.invoice.InvoiceStatus;
import com.invoiceme.features.invoices.getInvoice.InvoiceDto;
import com.invoiceme.shared.mapper.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Handler for listing invoices with optional filters
 * CQRS Query Handler
 */
@Service
@Transactional(readOnly = true)
public class ListInvoicesHandler {
    
    private final InvoiceRepository invoiceRepository;
    private final DtoMapper dtoMapper;
    
    public ListInvoicesHandler(InvoiceRepository invoiceRepository, DtoMapper dtoMapper) {
        this.invoiceRepository = invoiceRepository;
        this.dtoMapper = dtoMapper;
    }
    
    public List<InvoiceDto> handle(ListInvoicesQuery query) {
        List<Invoice> invoices;
        
        if (query.getStatus() != null && query.getCustomerId() != null) {
            // Filter by both status and customer
            InvoiceStatus status = InvoiceStatus.valueOf(query.getStatus());
            CustomerId customerId = new CustomerId(query.getCustomerId());
            invoices = invoiceRepository.findByCustomerIdAndStatus(customerId, status);
        } else if (query.getStatus() != null) {
            // Filter by status only
            InvoiceStatus status = InvoiceStatus.valueOf(query.getStatus());
            invoices = invoiceRepository.findByStatus(status);
        } else if (query.getCustomerId() != null) {
            // Filter by customer only
            CustomerId customerId = new CustomerId(query.getCustomerId());
            invoices = invoiceRepository.findByCustomerId(customerId);
        } else {
            // No filters - return all
            invoices = invoiceRepository.findAll();
        }
        
        return invoices.stream()
            .map(dtoMapper::toInvoiceDto)
            .collect(Collectors.toList());
    }
}

