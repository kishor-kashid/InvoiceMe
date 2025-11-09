package com.invoiceme.integration;

import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.invoice.InvoiceId;
import com.invoiceme.domain.invoice.InvoiceStatus;
import com.invoiceme.features.customers.createCustomer.CreateCustomerCommand;
import com.invoiceme.features.customers.createCustomer.CreateCustomerHandler;
import com.invoiceme.features.invoices.createInvoice.CreateInvoiceCommand;
import com.invoiceme.features.invoices.createInvoice.CreateInvoiceHandler;
import com.invoiceme.features.invoices.getInvoice.GetInvoiceHandler;
import com.invoiceme.features.invoices.getInvoice.GetInvoiceQuery;
import com.invoiceme.features.invoices.getInvoice.InvoiceDto;
import com.invoiceme.features.invoices.listInvoices.ListInvoicesHandler;
import com.invoiceme.features.invoices.listInvoices.ListInvoicesQuery;
import com.invoiceme.features.invoices.markInvoiceAsSent.MarkInvoiceAsSentCommand;
import com.invoiceme.features.invoices.markInvoiceAsSent.MarkInvoiceAsSentHandler;
import com.invoiceme.features.invoices.updateInvoice.UpdateInvoiceCommand;
import com.invoiceme.features.invoices.updateInvoice.UpdateInvoiceHandler;
import com.invoiceme.shared.exceptions.NotFoundException;
import com.invoiceme.shared.exceptions.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for complete invoice flow
 * Tests: Create customer → Create invoice → Add line items → Mark as sent
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class InvoiceFlowIntegrationTest {
    
    @Autowired
    private CreateCustomerHandler createCustomerHandler;
    
    @Autowired
    private CreateInvoiceHandler createInvoiceHandler;
    
    @Autowired
    private GetInvoiceHandler getInvoiceHandler;
    
    @Autowired
    private UpdateInvoiceHandler updateInvoiceHandler;
    
    @Autowired
    private MarkInvoiceAsSentHandler markInvoiceAsSentHandler;
    
    @Autowired
    private ListInvoicesHandler listInvoicesHandler;
    
    private String testCustomerId;
    
    @BeforeEach
    void setUp() {
        // Create a test customer for invoice tests
        CreateCustomerCommand customerCommand = new CreateCustomerCommand(
            "Test Customer",
            "customer@example.com",
            "+1-555-0100",
            "123 Main St",
            "New York",
            "NY",
            "10001",
            "USA"
        );
        testCustomerId = createCustomerHandler.handle(customerCommand);
    }
    
    @Test
    void testCompleteInvoiceFlow() {
        // 1. Create Invoice with Line Items
        CreateInvoiceCommand.LineItemCommand item1 = new CreateInvoiceCommand.LineItemCommand(
            "Web Development Services",
            40,
            100.00
        );
        
        CreateInvoiceCommand.LineItemCommand item2 = new CreateInvoiceCommand.LineItemCommand(
            "Domain Registration",
            1,
            15.00
        );
        
        CreateInvoiceCommand createCommand = new CreateInvoiceCommand(
            testCustomerId,
            "INV-2025-001",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            List.of(item1, item2),
            "USD",
            "Payment terms: Net 30 days"
        );
        
        String invoiceId = createInvoiceHandler.handle(createCommand);
        assertNotNull(invoiceId);
        
        // 2. Get Invoice and Verify
        GetInvoiceQuery getQuery = new GetInvoiceQuery(invoiceId);
        InvoiceDto invoiceDto = getInvoiceHandler.handle(getQuery);
        
        assertNotNull(invoiceDto);
        assertEquals("INV-2025-001", invoiceDto.getInvoiceNumber());
        assertEquals("DRAFT", invoiceDto.getStatus());
        assertEquals(testCustomerId, invoiceDto.getCustomerId());
        assertEquals(2, invoiceDto.getLineItems().size());
        
        // Verify total calculation (40 * 100 + 1 * 15 = 4015)
        assertEquals(4015.0, invoiceDto.getTotalAmount().getAmount());
        assertEquals("USD", invoiceDto.getTotalAmount().getCurrency());
        
        // 3. Update Invoice (only works in DRAFT)
        UpdateInvoiceCommand updateCommand = new UpdateInvoiceCommand(
            invoiceId,
            LocalDate.now(),
            LocalDate.now().plusDays(45),
            "Updated payment terms: Net 45 days"
        );
        
        updateInvoiceHandler.handle(updateCommand);
        
        // 4. Verify Update
        InvoiceDto updatedDto = getInvoiceHandler.handle(getQuery);
        assertEquals("Updated payment terms: Net 45 days", updatedDto.getNotes());
        
        // 5. Mark Invoice as Sent
        MarkInvoiceAsSentCommand sentCommand = new MarkInvoiceAsSentCommand(invoiceId);
        markInvoiceAsSentHandler.handle(sentCommand);
        
        // 6. Verify Status Changed
        InvoiceDto sentDto = getInvoiceHandler.handle(getQuery);
        assertEquals("SENT", sentDto.getStatus());
        assertNotNull(sentDto.getSentAt());
        
        // 7. Verify Cannot Update After Sent
        assertThrows(IllegalStateException.class, () -> {
            updateInvoiceHandler.handle(updateCommand);
        });
        
        // 8. List Invoices by Status
        ListInvoicesQuery listQuery = new ListInvoicesQuery("SENT", null);
        List<InvoiceDto> invoices = listInvoicesHandler.handle(listQuery);
        
        assertNotNull(invoices);
        assertTrue(invoices.stream().anyMatch(i -> i.getId().equals(invoiceId)));
        
        // 9. List Invoices by Customer
        ListInvoicesQuery customerQuery = new ListInvoicesQuery(null, testCustomerId);
        List<InvoiceDto> customerInvoices = listInvoicesHandler.handle(customerQuery);
        
        assertTrue(customerInvoices.stream().anyMatch(i -> i.getId().equals(invoiceId)));
    }
    
    @Test
    void testInvoiceWithMultipleLineItems() {
        CreateInvoiceCommand.LineItemCommand item1 = new CreateInvoiceCommand.LineItemCommand(
            "Item 1", 2, 50.00
        );
        CreateInvoiceCommand.LineItemCommand item2 = new CreateInvoiceCommand.LineItemCommand(
            "Item 2", 3, 75.00
        );
        CreateInvoiceCommand.LineItemCommand item3 = new CreateInvoiceCommand.LineItemCommand(
            "Item 3", 1, 100.00
        );
        
        CreateInvoiceCommand command = new CreateInvoiceCommand(
            testCustomerId,
            "INV-2025-002",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            List.of(item1, item2, item3),
            "USD",
            null
        );
        
        String invoiceId = createInvoiceHandler.handle(command);
        
        GetInvoiceQuery query = new GetInvoiceQuery(invoiceId);
        InvoiceDto dto = getInvoiceHandler.handle(query);
        
        assertEquals(3, dto.getLineItems().size());
        // Total: (2*50) + (3*75) + (1*100) = 100 + 225 + 100 = 425
        assertEquals(425.0, dto.getTotalAmount().getAmount());
    }
    
    @Test
    void testDuplicateInvoiceNumber() {
        CreateInvoiceCommand.LineItemCommand item = new CreateInvoiceCommand.LineItemCommand(
            "Service", 1, 100.00
        );
        
        CreateInvoiceCommand command1 = new CreateInvoiceCommand(
            testCustomerId,
            "INV-DUPLICATE",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            List.of(item),
            "USD",
            null
        );
        
        createInvoiceHandler.handle(command1);
        
        // Try to create another invoice with same number
        CreateInvoiceCommand command2 = new CreateInvoiceCommand(
            testCustomerId,
            "INV-DUPLICATE",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            List.of(item),
            "USD",
            null
        );
        
        assertThrows(BusinessException.class, () -> {
            createInvoiceHandler.handle(command2);
        });
    }
    
    @Test
    void testGetNonExistentInvoice() {
        String nonExistentId = UUID.randomUUID().toString();
        GetInvoiceQuery query = new GetInvoiceQuery(nonExistentId);
        
        assertThrows(NotFoundException.class, () -> {
            getInvoiceHandler.handle(query);
        });
    }
    
    @Test
    void testMarkNonDraftInvoiceAsSent() {
        // Create and mark invoice as sent
        CreateInvoiceCommand.LineItemCommand item = new CreateInvoiceCommand.LineItemCommand(
            "Service", 1, 100.00
        );
        
        CreateInvoiceCommand createCommand = new CreateInvoiceCommand(
            testCustomerId,
            "INV-2025-003",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            List.of(item),
            "USD",
            null
        );
        
        String invoiceId = createInvoiceHandler.handle(createCommand);
        
        MarkInvoiceAsSentCommand sentCommand = new MarkInvoiceAsSentCommand(invoiceId);
        markInvoiceAsSentHandler.handle(sentCommand);
        
        // Try to mark as sent again
        assertThrows(IllegalStateException.class, () -> {
            markInvoiceAsSentHandler.handle(sentCommand);
        });
    }
}

