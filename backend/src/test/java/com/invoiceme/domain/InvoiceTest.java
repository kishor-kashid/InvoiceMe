package com.invoiceme.domain;

import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.invoice.InvoiceStatus;
import com.invoiceme.domain.invoice.LineItem;
import com.invoiceme.domain.shared.Money;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Invoice domain entity
 */
class InvoiceTest {
    
    @Test
    void shouldCreateInvoiceWithValidData() {
        // Given
        InvoiceId id = InvoiceId.generate();
        CustomerId customerId = CustomerId.generate();
        String invoiceNumber = "INV-001";
        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = LocalDate.now().plusDays(30);
        String currency = "USD";
        
        // When
        Invoice invoice = new Invoice(id, customerId, invoiceNumber, issueDate, dueDate, currency);
        
        // Then
        assertNotNull(invoice);
        assertEquals(id, invoice.getId());
        assertEquals(customerId, invoice.getCustomerId());
        assertEquals(invoiceNumber, invoice.getInvoiceNumber());
        assertEquals(InvoiceStatus.DRAFT, invoice.getStatus());
        assertEquals(issueDate, invoice.getIssueDate());
        assertEquals(dueDate, invoice.getDueDate());
        assertEquals(Money.zero(currency), invoice.getTotalAmount());
        assertEquals(Money.zero(currency), invoice.getPaidAmount());
    }
    
    @Test
    void shouldCreateInvoiceUsingFactoryMethod() {
        // Given
        CustomerId customerId = CustomerId.generate();
        String invoiceNumber = "INV-002";
        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = LocalDate.now().plusDays(30);
        
        // When
        Invoice invoice = Invoice.create(customerId, invoiceNumber, issueDate, dueDate, "USD");
        
        // Then
        assertNotNull(invoice);
        assertNotNull(invoice.getId());
        assertEquals(InvoiceStatus.DRAFT, invoice.getStatus());
    }
    
    @Test
    void shouldThrowExceptionWhenDueDateIsBeforeIssueDate() {
        // Given
        CustomerId customerId = CustomerId.generate();
        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = LocalDate.now().minusDays(1);
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () ->
            Invoice.create(customerId, "INV-003", issueDate, dueDate, "USD")
        );
    }
    
    @Test
    void shouldAddLineItemToInvoice() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-004",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        
        LineItem lineItem = new LineItem("Product A", 2, new Money(100.00, "USD"));
        
        // When
        invoice.addLineItem(lineItem);
        
        // Then
        assertEquals(1, invoice.getLineItems().size());
        assertEquals(new Money(200.00, "USD"), invoice.getTotalAmount());
    }
    
    @Test
    void shouldCalculateTotalFromMultipleLineItems() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-005",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        
        LineItem item1 = new LineItem("Product A", 2, new Money(100.00, "USD"));
        LineItem item2 = new LineItem("Product B", 1, new Money(50.00, "USD"));
        LineItem item3 = new LineItem("Product C", 3, new Money(25.00, "USD"));
        
        // When
        invoice.addLineItem(item1);
        invoice.addLineItem(item2);
        invoice.addLineItem(item3);
        
        // Then
        assertEquals(3, invoice.getLineItems().size());
        // Total: (2 * 100) + (1 * 50) + (3 * 25) = 200 + 50 + 75 = 325
        assertEquals(new Money(325.00, "USD"), invoice.getTotalAmount());
    }
    
    @Test
    void shouldRemoveLineItemFromInvoice() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-006",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        
        LineItem item1 = new LineItem("Product A", 2, new Money(100.00, "USD"));
        LineItem item2 = new LineItem("Product B", 1, new Money(50.00, "USD"));
        invoice.addLineItem(item1);
        invoice.addLineItem(item2);
        
        // When
        invoice.removeLineItem(item1.getId());
        
        // Then
        assertEquals(1, invoice.getLineItems().size());
        assertEquals(new Money(50.00, "USD"), invoice.getTotalAmount());
    }
    
    @Test
    void shouldMarkInvoiceAsSent() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-007",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        invoice.addLineItem(new LineItem("Product A", 1, new Money(100.00, "USD")));
        
        // When
        invoice.markAsSent();
        
        // Then
        assertEquals(InvoiceStatus.SENT, invoice.getStatus());
        assertNotNull(invoice.getSentAt());
    }
    
    @Test
    void shouldThrowExceptionWhenMarkingEmptyInvoiceAsSent() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-008",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        
        // When & Then
        assertThrows(IllegalStateException.class, invoice::markAsSent);
    }
    
    @Test
    void shouldThrowExceptionWhenAddingLineItemToSentInvoice() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-009",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        invoice.addLineItem(new LineItem("Product A", 1, new Money(100.00, "USD")));
        invoice.markAsSent();
        
        LineItem newItem = new LineItem("Product B", 1, new Money(50.00, "USD"));
        
        // When & Then
        assertThrows(IllegalStateException.class, () -> invoice.addLineItem(newItem));
    }
    
    @Test
    void shouldApplyPaymentToInvoice() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-010",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        invoice.addLineItem(new LineItem("Product A", 1, new Money(100.00, "USD")));
        invoice.markAsSent();
        
        Money payment = new Money(50.00, "USD");
        
        // When
        invoice.applyPayment(payment);
        
        // Then
        assertEquals(new Money(50.00, "USD"), invoice.getPaidAmount());
        assertEquals(new Money(50.00, "USD"), invoice.calculateBalance());
        assertEquals(InvoiceStatus.SENT, invoice.getStatus());
    }
    
    @Test
    void shouldMarkInvoiceAsPaidWhenFullyPaid() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-011",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        invoice.addLineItem(new LineItem("Product A", 1, new Money(100.00, "USD")));
        invoice.markAsSent();
        
        Money fullPayment = new Money(100.00, "USD");
        
        // When
        invoice.applyPayment(fullPayment);
        
        // Then
        assertEquals(InvoiceStatus.PAID, invoice.getStatus());
        assertTrue(invoice.isFullyPaid());
        assertEquals(Money.zero("USD"), invoice.calculateBalance());
    }
    
    @Test
    void shouldThrowExceptionWhenPaymentExceedsBalance() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-012",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        invoice.addLineItem(new LineItem("Product A", 1, new Money(100.00, "USD")));
        invoice.markAsSent();
        
        Money overpayment = new Money(150.00, "USD");
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> invoice.applyPayment(overpayment));
    }
    
    @Test
    void shouldThrowExceptionWhenApplyingPaymentToDraftInvoice() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-013",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        invoice.addLineItem(new LineItem("Product A", 1, new Money(100.00, "USD")));
        
        Money payment = new Money(50.00, "USD");
        
        // When & Then
        assertThrows(IllegalStateException.class, () -> invoice.applyPayment(payment));
    }
    
    @Test
    void shouldCalculateBalanceCorrectly() {
        // Given
        Invoice invoice = Invoice.create(
            CustomerId.generate(),
            "INV-014",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            "USD"
        );
        invoice.addLineItem(new LineItem("Product A", 2, new Money(100.00, "USD")));
        invoice.markAsSent();
        
        // When
        invoice.applyPayment(new Money(75.00, "USD"));
        
        // Then
        assertEquals(new Money(200.00, "USD"), invoice.getTotalAmount());
        assertEquals(new Money(75.00, "USD"), invoice.getPaidAmount());
        assertEquals(new Money(125.00, "USD"), invoice.calculateBalance());
    }
}

