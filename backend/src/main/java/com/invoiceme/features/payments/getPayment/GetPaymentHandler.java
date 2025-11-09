package com.invoiceme.features.payments.getPayment;

import com.invoiceme.domain.payment.Payment;
import com.invoiceme.domain.payment.PaymentId;
import com.invoiceme.domain.payment.PaymentRepository;
import com.invoiceme.shared.exceptions.NotFoundException;
import com.invoiceme.shared.mapper.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for getting a payment by ID
 * CQRS Query Handler
 */
@Service
@Transactional(readOnly = true)
public class GetPaymentHandler {
    
    private final PaymentRepository paymentRepository;
    private final DtoMapper dtoMapper;
    
    public GetPaymentHandler(PaymentRepository paymentRepository, DtoMapper dtoMapper) {
        this.paymentRepository = paymentRepository;
        this.dtoMapper = dtoMapper;
    }
    
    public PaymentDto handle(GetPaymentQuery query) {
        PaymentId paymentId = new PaymentId(query.getPaymentId());
        
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new NotFoundException("Payment", query.getPaymentId()));
        
        return dtoMapper.toPaymentDto(payment);
    }
}

