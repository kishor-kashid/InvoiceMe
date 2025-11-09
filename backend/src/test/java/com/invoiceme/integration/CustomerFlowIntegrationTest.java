package com.invoiceme.integration;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.customer.CustomerRepository;
import com.invoiceme.domain.shared.Address;
import com.invoiceme.domain.shared.Email;
import com.invoiceme.features.customers.createCustomer.CreateCustomerCommand;
import com.invoiceme.features.customers.createCustomer.CreateCustomerHandler;
import com.invoiceme.features.customers.deleteCustomer.DeleteCustomerCommand;
import com.invoiceme.features.customers.deleteCustomer.DeleteCustomerHandler;
import com.invoiceme.features.customers.getCustomer.CustomerDto;
import com.invoiceme.features.customers.getCustomer.GetCustomerHandler;
import com.invoiceme.features.customers.getCustomer.GetCustomerQuery;
import com.invoiceme.features.customers.listCustomers.ListCustomersHandler;
import com.invoiceme.features.customers.listCustomers.ListCustomersQuery;
import com.invoiceme.features.customers.updateCustomer.UpdateCustomerCommand;
import com.invoiceme.features.customers.updateCustomer.UpdateCustomerHandler;
import com.invoiceme.shared.exceptions.NotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import com.invoiceme.shared.exceptions.BusinessException;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for complete customer flow
 * Tests: Create → Get → Update → List → Delete
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class CustomerFlowIntegrationTest {
    
    @Autowired
    private CreateCustomerHandler createCustomerHandler;
    
    @Autowired
    private GetCustomerHandler getCustomerHandler;
    
    @Autowired
    private UpdateCustomerHandler updateCustomerHandler;
    
    @Autowired
    private ListCustomersHandler listCustomersHandler;
    
    @Autowired
    private DeleteCustomerHandler deleteCustomerHandler;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Test
    void testCompleteCustomerFlow() {
        // 1. Create Customer
        CreateCustomerCommand createCommand = new CreateCustomerCommand(
            "John Doe",
            "john.doe@example.com",
            "+1-555-0100",
            "123 Main Street",
            "New York",
            "NY",
            "10001",
            "USA"
        );
        
        String customerId = createCustomerHandler.handle(createCommand);
        assertNotNull(customerId);
        
        // 2. Get Customer by ID
        GetCustomerQuery getQuery = new GetCustomerQuery(customerId);
        CustomerDto customerDto = getCustomerHandler.handle(getQuery);
        
        assertNotNull(customerDto);
        assertEquals("John Doe", customerDto.getName());
        assertEquals("john.doe@example.com", customerDto.getEmail());
        assertEquals("+1-555-0100", customerDto.getPhone());
        assertEquals("123 Main Street", customerDto.getAddress().getStreet());
        assertEquals("New York", customerDto.getAddress().getCity());
        
        // 3. Update Customer
        UpdateCustomerCommand updateCommand = new UpdateCustomerCommand(
            customerId,
            "John Smith",
            "john.smith@example.com",
            "+1-555-0200",
            "456 Oak Avenue",
            "Los Angeles",
            "CA",
            "90001",
            "USA"
        );
        
        updateCustomerHandler.handle(updateCommand);
        
        // 4. Verify Update
        CustomerDto updatedDto = getCustomerHandler.handle(getQuery);
        assertEquals("John Smith", updatedDto.getName());
        assertEquals("john.smith@example.com", updatedDto.getEmail());
        assertEquals("+1-555-0200", updatedDto.getPhone());
        assertEquals("456 Oak Avenue", updatedDto.getAddress().getStreet());
        assertEquals("Los Angeles", updatedDto.getAddress().getCity());
        assertEquals("CA", updatedDto.getAddress().getState());
        
        // 5. List All Customers
        ListCustomersQuery listQuery = new ListCustomersQuery();
        List<CustomerDto> customers = listCustomersHandler.handle(listQuery);
        
        assertNotNull(customers);
        assertTrue(customers.size() >= 1);
        assertTrue(customers.stream().anyMatch(c -> c.getId().equals(customerId)));
        
        // 6. Delete Customer
        DeleteCustomerCommand deleteCommand = new DeleteCustomerCommand(customerId);
        deleteCustomerHandler.handle(deleteCommand);
        
        // 7. Verify Deletion
        assertThrows(NotFoundException.class, () -> {
            getCustomerHandler.handle(getQuery);
        });
        
        assertFalse(customerRepository.existsById(new com.invoiceme.domain.customer.CustomerId(customerId)));
    }
    
    @Test
    void testDuplicateEmailValidation() {
        // Create first customer
        CreateCustomerCommand command1 = new CreateCustomerCommand(
            "Customer One",
            "duplicate@example.com",
            "+1-555-0100",
            "123 Main St",
            "New York",
            "NY",
            "10001",
            "USA"
        );
        
        createCustomerHandler.handle(command1);
        
        // Try to create second customer with same email
        CreateCustomerCommand command2 = new CreateCustomerCommand(
            "Customer Two",
            "duplicate@example.com",
            "+1-555-0200",
            "456 Oak Ave",
            "Los Angeles",
            "CA",
            "90001",
            "USA"
        );
        
        assertThrows(BusinessException.class, () -> {
            createCustomerHandler.handle(command2);
        });
    }
    
    @Test
    void testGetNonExistentCustomer() {
        String nonExistentId = UUID.randomUUID().toString();
        GetCustomerQuery query = new GetCustomerQuery(nonExistentId);
        
        assertThrows(NotFoundException.class, () -> {
            getCustomerHandler.handle(query);
        });
    }
    
    @Test
    void testDeleteNonExistentCustomer() {
        String nonExistentId = UUID.randomUUID().toString();
        DeleteCustomerCommand command = new DeleteCustomerCommand(nonExistentId);
        
        assertThrows(NotFoundException.class, () -> {
            deleteCustomerHandler.handle(command);
        });
    }
}

