package com.invoiceme.features.payments.listPaymentsForInvoice;

import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.payment.PaymentRepository;
import com.invoiceme.features.payments.getPayment.PaymentDto;
import com.invoiceme.shared.mapper.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Handler for listing all payments for an invoice
 * CQRS Query Handler
 */
@Service
@Transactional(readOnly = true)
public class ListPaymentsForInvoiceHandler {
    
    private final PaymentRepository paymentRepository;
    private final DtoMapper dtoMapper;
    
    public ListPaymentsForInvoiceHandler(PaymentRepository paymentRepository, DtoMapper dtoMapper) {
        this.paymentRepository = paymentRepository;
        this.dtoMapper = dtoMapper;
    }
    
    public List<PaymentDto> handle(ListPaymentsForInvoiceQuery query) {
        InvoiceId invoiceId = new InvoiceId(query.getInvoiceId());
        
        return paymentRepository.findByInvoiceId(invoiceId).stream()
            .map(dtoMapper::toPaymentDto)
            .collect(Collectors.toList());
    }
}

