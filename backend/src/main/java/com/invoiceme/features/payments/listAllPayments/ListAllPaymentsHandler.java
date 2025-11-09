package com.invoiceme.features.payments.listAllPayments;

import com.invoiceme.domain.payment.PaymentRepository;
import com.invoiceme.features.payments.getPayment.PaymentDto;
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
    
    /**
     * Handle list all payments query without pagination (backward compatibility)
     */
    public List<PaymentDto> handle(ListAllPaymentsQuery query) {
        return paymentRepository.findAll().stream()
            .map(dtoMapper::toPaymentDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Handle list all payments query with pagination
     */
    public PageResponse<PaymentDto> handlePaginated(ListAllPaymentsQuery query, int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<PaymentDto> paymentPage = paymentRepository.findAll(pageable)
            .map(dtoMapper::toPaymentDto);
        
        return PageResponse.of(paymentPage);
    }
}

