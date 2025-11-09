package com.invoiceme.features.invoices.listInvoices;

import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceRepository;
import com.invoiceme.domain.invoice.InvoiceStatus;
import com.invoiceme.features.invoices.getInvoice.InvoiceDto;
import com.invoiceme.shared.mapper.DtoMapper;
import com.invoiceme.shared.pagination.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    
    /**
     * Handle list invoices query without pagination (backward compatibility)
     */
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
    
    /**
     * Handle list invoices query with pagination
     */
    public PageResponse<InvoiceDto> handlePaginated(ListInvoicesQuery query, int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<Invoice> invoicePage;
        
        if (query.getStatus() != null && query.getCustomerId() != null) {
            // Filter by both status and customer
            InvoiceStatus status = InvoiceStatus.valueOf(query.getStatus());
            CustomerId customerId = new CustomerId(query.getCustomerId());
            // Note: For combined filters, we'll use findAll and filter in memory
            // In production, consider adding custom repository method
            List<Invoice> filtered = invoiceRepository.findByCustomerIdAndStatus(customerId, status);
            invoicePage = new org.springframework.data.domain.PageImpl<>(
                filtered.stream().skip((long) page * size).limit(size).collect(Collectors.toList()),
                pageable,
                filtered.size()
            );
        } else if (query.getStatus() != null) {
            // Filter by status only
            InvoiceStatus status = InvoiceStatus.valueOf(query.getStatus());
            invoicePage = invoiceRepository.findByStatus(status, pageable);
        } else if (query.getCustomerId() != null) {
            // Filter by customer only
            CustomerId customerId = new CustomerId(query.getCustomerId());
            invoicePage = invoiceRepository.findByCustomerId(customerId, pageable);
        } else {
            // No filters - return all
            invoicePage = invoiceRepository.findAll(pageable);
        }
        
        Page<InvoiceDto> dtoPage = invoicePage.map(dtoMapper::toInvoiceDto);
        return PageResponse.of(dtoPage);
    }
}

