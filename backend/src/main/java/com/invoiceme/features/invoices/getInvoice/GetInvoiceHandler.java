package com.invoiceme.features.invoices.getInvoice;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.invoice.InvoiceRepository;
import com.invoiceme.shared.exceptions.NotFoundException;
import com.invoiceme.shared.mapper.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for getting an invoice by ID
 * CQRS Query Handler
 */
@Service
@Transactional(readOnly = true)
public class GetInvoiceHandler {
    
    private final InvoiceRepository invoiceRepository;
    private final DtoMapper dtoMapper;
    
    public GetInvoiceHandler(InvoiceRepository invoiceRepository, DtoMapper dtoMapper) {
        this.invoiceRepository = invoiceRepository;
        this.dtoMapper = dtoMapper;
    }
    
    public InvoiceDto handle(GetInvoiceQuery query) {
        InvoiceId invoiceId = new InvoiceId(query.getInvoiceId());
        
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new NotFoundException("Invoice", query.getInvoiceId()));
        
        return dtoMapper.toInvoiceDto(invoice);
    }
}

