package com.invoiceme.shared.mapper;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.LineItem;
import com.invoiceme.domain.payment.Payment;
import com.invoiceme.domain.shared.Address;
import com.invoiceme.domain.shared.Email;
import com.invoiceme.domain.shared.Money;
import com.invoiceme.features.customers.getCustomer.CustomerDto;
import com.invoiceme.features.invoices.getInvoice.InvoiceDto;
import com.invoiceme.features.invoices.getInvoice.LineItemDto;
import com.invoiceme.features.payments.getPayment.PaymentDto;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * Utility class for mapping between domain entities and DTOs
 */
@Component
public class DtoMapper {
    
    // Customer mapping
    public CustomerDto toCustomerDto(Customer customer) {
        CustomerDto.AddressDto addressDto = null;
        if (customer.getAddress() != null) {
            Address address = customer.getAddress();
            addressDto = new CustomerDto.AddressDto(
                address.getStreet(),
                address.getCity(),
                address.getState(),
                address.getZipCode(),
                address.getCountry()
            );
        }
        
        return new CustomerDto(
            customer.getId().getId(),
            customer.getName(),
            customer.getEmail().getValue(),
            customer.getPhone(),
            addressDto,
            customer.getCreatedAt(),
            customer.getUpdatedAt()
        );
    }
    
    public Address toAddress(String street, String city, String state, String zipCode, String country) {
        return new Address(street, city, state, zipCode, country);
    }
    
    public Email toEmail(String email) {
        return new Email(email);
    }
    
    // Invoice mapping
    public InvoiceDto toInvoiceDto(Invoice invoice) {
        return new InvoiceDto(
            invoice.getId().getId(),
            invoice.getCustomerId().getId(),
            invoice.getInvoiceNumber(),
            invoice.getStatus().name(),
            invoice.getIssueDate(),
            invoice.getDueDate(),
            invoice.getLineItems().stream()
                .map(this::toLineItemDto)
                .collect(Collectors.toList()),
            toMoneyDto(invoice.getTotalAmount()),
            toMoneyDto(invoice.getPaidAmount()),
            toMoneyDto(invoice.calculateBalance()),
            invoice.getNotes(),
            invoice.getCreatedAt(),
            invoice.getUpdatedAt(),
            invoice.getSentAt()
        );
    }
    
    public LineItemDto toLineItemDto(LineItem lineItem) {
        return new LineItemDto(
            lineItem.getId(),
            lineItem.getDescription(),
            lineItem.getQuantity(),
            toMoneyDto(lineItem.getUnitPrice()),
            toMoneyDto(lineItem.calculateTotal())
        );
    }
    
    public Money toMoney(Double amount, String currency) {
        return new Money(amount, currency);
    }
    
    private InvoiceDto.MoneyDto toMoneyDto(Money money) {
        return new InvoiceDto.MoneyDto(
            money.getAmount().doubleValue(),
            money.getCurrency()
        );
    }
    
    // Payment mapping
    public PaymentDto toPaymentDto(Payment payment) {
        return new PaymentDto(
            payment.getId().getId(),
            payment.getInvoiceId().getId(),
            payment.getAmount().getAmount().doubleValue(),
            payment.getAmount().getCurrency(),
            payment.getPaymentDate(),
            payment.getPaymentMethod(),
            payment.getReferenceNumber(),
            payment.getNotes(),
            payment.getCreatedAt()
        );
    }
}

