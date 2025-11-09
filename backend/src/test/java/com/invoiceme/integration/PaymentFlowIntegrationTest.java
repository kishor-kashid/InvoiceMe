package com.invoiceme.integration;

import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.invoice.InvoiceStatus;
import com.invoiceme.domain.payment.PaymentId;
import com.invoiceme.features.customers.createCustomer.CreateCustomerCommand;
import com.invoiceme.features.customers.createCustomer.CreateCustomerHandler;
import com.invoiceme.features.invoices.createInvoice.CreateInvoiceCommand;
import com.invoiceme.features.invoices.createInvoice.CreateInvoiceHandler;
import com.invoiceme.features.invoices.getInvoice.GetInvoiceHandler;
import com.invoiceme.features.invoices.getInvoice.GetInvoiceQuery;
import com.invoiceme.features.invoices.getInvoice.InvoiceDto;
import com.invoiceme.features.invoices.markInvoiceAsSent.MarkInvoiceAsSentCommand;
import com.invoiceme.features.invoices.markInvoiceAsSent.MarkInvoiceAsSentHandler;
import com.invoiceme.features.invoices.recordPayment.RecordPaymentCommand;
import com.invoiceme.features.invoices.recordPayment.RecordPaymentHandler;
import com.invoiceme.features.payments.getPayment.GetPaymentHandler;
import com.invoiceme.features.payments.getPayment.GetPaymentQuery;
import com.invoiceme.features.payments.getPayment.PaymentDto;
import com.invoiceme.features.payments.listPaymentsForInvoice.ListPaymentsForInvoiceHandler;
import com.invoiceme.features.payments.listPaymentsForInvoice.ListPaymentsForInvoiceQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for complete payment flow
 * Tests: Create invoice → Record partial payment → Record final payment → Verify PAID status
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PaymentFlowIntegrationTest {
    
    @Autowired
    private CreateCustomerHandler createCustomerHandler;
    
    @Autowired
    private CreateInvoiceHandler createInvoiceHandler;
    
    @Autowired
    private GetInvoiceHandler getInvoiceHandler;
    
    @Autowired
    private MarkInvoiceAsSentHandler markInvoiceAsSentHandler;
    
    @Autowired
    private RecordPaymentHandler recordPaymentHandler;
    
    @Autowired
    private GetPaymentHandler getPaymentHandler;
    
    @Autowired
    private ListPaymentsForInvoiceHandler listPaymentsForInvoiceHandler;
    
    private String testCustomerId;
    private String testInvoiceId;
    
    @BeforeEach
    void setUp() {
        // Create customer
        CreateCustomerCommand customerCommand = new CreateCustomerCommand(
            "Payment Test Customer",
            "payment@example.com",
            "+1-555-0100",
            "123 Main St",
            "New York",
            "NY",
            "10001",
            "USA"
        );
        testCustomerId = createCustomerHandler.handle(customerCommand);
        
        // Create invoice with total of $1000
        CreateInvoiceCommand.LineItemCommand item = new CreateInvoiceCommand.LineItemCommand(
            "Services Rendered",
            10,
            100.00
        );
        
        CreateInvoiceCommand invoiceCommand = new CreateInvoiceCommand(
            testCustomerId,
            "INV-PAY-001",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            List.of(item),
            "USD",
            null
        );
        
        testInvoiceId = createInvoiceHandler.handle(invoiceCommand);
        
        // Mark invoice as sent so it can accept payments
        MarkInvoiceAsSentCommand sentCommand = new MarkInvoiceAsSentCommand(testInvoiceId);
        markInvoiceAsSentHandler.handle(sentCommand);
    }
    
    @Test
    void testCompletePaymentFlow() {
        // 1. Verify Initial Invoice State
        GetInvoiceQuery getInvoiceQuery = new GetInvoiceQuery(testInvoiceId);
        InvoiceDto initialInvoice = getInvoiceHandler.handle(getInvoiceQuery);
        
        assertEquals("SENT", initialInvoice.getStatus());
        assertEquals(1000.0, initialInvoice.getTotalAmount().getAmount());
        assertEquals(0.0, initialInvoice.getPaidAmount().getAmount());
        assertEquals(1000.0, initialInvoice.getBalance().getAmount());
        
        // 2. Record First Partial Payment ($400)
        RecordPaymentCommand payment1Command = new RecordPaymentCommand(
            testInvoiceId,
            400.00,
            LocalDateTime.now(),
            "Bank Transfer",
            "TXN-001",
            "First installment"
        );
        
        String payment1Id = recordPaymentHandler.handle(payment1Command);
        assertNotNull(payment1Id);
        
        // 3. Verify Invoice After First Payment
        InvoiceDto afterPayment1 = getInvoiceHandler.handle(getInvoiceQuery);
        assertEquals("SENT", afterPayment1.getStatus()); // Still SENT, not fully paid
        assertEquals(400.0, afterPayment1.getPaidAmount().getAmount());
        assertEquals(600.0, afterPayment1.getBalance().getAmount());
        
        // 4. Record Second Partial Payment ($350)
        RecordPaymentCommand payment2Command = new RecordPaymentCommand(
            testInvoiceId,
            350.00,
            LocalDateTime.now(),
            "Credit Card",
            "TXN-002",
            "Second installment"
        );
        
        String payment2Id = recordPaymentHandler.handle(payment2Command);
        assertNotNull(payment2Id);
        
        // 5. Verify Invoice After Second Payment
        InvoiceDto afterPayment2 = getInvoiceHandler.handle(getInvoiceQuery);
        assertEquals("SENT", afterPayment2.getStatus()); // Still SENT
        assertEquals(750.0, afterPayment2.getPaidAmount().getAmount());
        assertEquals(250.0, afterPayment2.getBalance().getAmount());
        
        // 6. Record Final Payment ($250)
        RecordPaymentCommand payment3Command = new RecordPaymentCommand(
            testInvoiceId,
            250.00,
            LocalDateTime.now(),
            "Cash",
            "TXN-003",
            "Final payment"
        );
        
        String payment3Id = recordPaymentHandler.handle(payment3Command);
        assertNotNull(payment3Id);
        
        // 7. Verify Invoice Status Changed to PAID
        InvoiceDto finalInvoice = getInvoiceHandler.handle(getInvoiceQuery);
        assertEquals("PAID", finalInvoice.getStatus()); // Now PAID
        assertEquals(1000.0, finalInvoice.getPaidAmount().getAmount());
        assertEquals(0.0, finalInvoice.getBalance().getAmount());
        
        // 8. List All Payments for Invoice
        ListPaymentsForInvoiceQuery listQuery = new ListPaymentsForInvoiceQuery(testInvoiceId);
        List<PaymentDto> payments = listPaymentsForInvoiceHandler.handle(listQuery);
        
        assertEquals(3, payments.size());
        
        // 9. Verify Individual Payments
        GetPaymentQuery getPayment1Query = new GetPaymentQuery(payment1Id);
        PaymentDto payment1Dto = getPaymentHandler.handle(getPayment1Query);
        
        assertEquals(400.0, payment1Dto.getAmount());
        assertEquals("Bank Transfer", payment1Dto.getPaymentMethod());
        assertEquals("TXN-001", payment1Dto.getReferenceNumber());
        assertEquals("First installment", payment1Dto.getNotes());
    }
    
    @Test
    void testFullPaymentInOneTransaction() {
        // Create new invoice for $500
        CreateInvoiceCommand.LineItemCommand item = new CreateInvoiceCommand.LineItemCommand(
            "Single Payment Test",
            5,
            100.00
        );
        
        CreateInvoiceCommand invoiceCommand = new CreateInvoiceCommand(
            testCustomerId,
            "INV-PAY-002",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            List.of(item),
            "USD",
            null
        );
        
        String invoiceId = createInvoiceHandler.handle(invoiceCommand);
        
        // Mark as sent
        MarkInvoiceAsSentCommand sentCommand = new MarkInvoiceAsSentCommand(invoiceId);
        markInvoiceAsSentHandler.handle(sentCommand);
        
        // Pay full amount in one transaction
        RecordPaymentCommand paymentCommand = new RecordPaymentCommand(
            invoiceId,
            500.00,
            LocalDateTime.now(),
            "Wire Transfer",
            "FULL-PAY-001",
            "Full payment"
        );
        
        recordPaymentHandler.handle(paymentCommand);
        
        // Verify invoice is PAID
        GetInvoiceQuery query = new GetInvoiceQuery(invoiceId);
        InvoiceDto invoice = getInvoiceHandler.handle(query);
        
        assertEquals("PAID", invoice.getStatus());
        assertEquals(500.0, invoice.getPaidAmount().getAmount());
        assertEquals(0.0, invoice.getBalance().getAmount());
    }
    
    @Test
    void testCannotPayMoreThanBalance() {
        // Try to pay more than the remaining balance
        RecordPaymentCommand paymentCommand = new RecordPaymentCommand(
            testInvoiceId,
            1500.00, // More than $1000 total
            LocalDateTime.now(),
            "Bank Transfer",
            "OVER-PAY",
            "Overpayment attempt"
        );
        
        assertThrows(IllegalArgumentException.class, () -> {
            recordPaymentHandler.handle(paymentCommand);
        });
    }
    
    @Test
    void testCannotPayDraftInvoice() {
        // Create a new DRAFT invoice
        CreateInvoiceCommand.LineItemCommand item = new CreateInvoiceCommand.LineItemCommand(
            "Draft Test",
            1,
            100.00
        );
        
        CreateInvoiceCommand invoiceCommand = new CreateInvoiceCommand(
            testCustomerId,
            "INV-PAY-DRAFT",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            List.of(item),
            "USD",
            null
        );
        
        String draftInvoiceId = createInvoiceHandler.handle(invoiceCommand);
        
        // Try to pay DRAFT invoice (should fail)
        RecordPaymentCommand paymentCommand = new RecordPaymentCommand(
            draftInvoiceId,
            50.00,
            LocalDateTime.now(),
            "Cash",
            "DRAFT-PAY",
            "Payment to draft invoice"
        );
        
        assertThrows(IllegalStateException.class, () -> {
            recordPaymentHandler.handle(paymentCommand);
        });
    }
    
    @Test
    void testCannotPayAlreadyPaidInvoice() {
        // Pay invoice in full
        RecordPaymentCommand fullPayment = new RecordPaymentCommand(
            testInvoiceId,
            1000.00,
            LocalDateTime.now(),
            "Bank Transfer",
            "FULL-001",
            "Full payment"
        );
        
        recordPaymentHandler.handle(fullPayment);
        
        // Verify it's paid
        GetInvoiceQuery query = new GetInvoiceQuery(testInvoiceId);
        InvoiceDto invoice = getInvoiceHandler.handle(query);
        assertEquals("PAID", invoice.getStatus());
        
        // Try to pay again (should fail because balance is zero)
        RecordPaymentCommand extraPayment = new RecordPaymentCommand(
            testInvoiceId,
            10.00,
            LocalDateTime.now(),
            "Cash",
            "EXTRA-001",
            "Extra payment"
        );
        
        assertThrows(IllegalStateException.class, () -> {
            recordPaymentHandler.handle(extraPayment);
        });
    }
}
