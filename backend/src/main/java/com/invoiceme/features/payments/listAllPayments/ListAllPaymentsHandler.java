package com.invoiceme.features.payments.listAllPayments;

import com.invoiceme.domain.payment.PaymentRepository;
import com.invoiceme.features.payments.getPayment.PaymentDto;
import com.invoiceme.shared.mapper.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Handler for listing all payments across all invoices
 * CQRS Query Handler
 */
@Service
@Transactional(readOnly = true)
public class ListAllPaymentsHandler {
    
    private final PaymentRepository paymentRepository;
    private final DtoMapper dtoMapper;
    
    public ListAllPaymentsHandler(PaymentRepository paymentRepository, DtoMapper dtoMapper) {
        this.paymentRepository = paymentRepository;
        this.dtoMapper = dtoMapper;
    }
    
    public List<PaymentDto> handle(ListAllPaymentsQuery query) {
        return paymentRepository.findAll().stream()
            .map(dtoMapper::toPaymentDto)
            .collect(Collectors.toList());
    }
}

