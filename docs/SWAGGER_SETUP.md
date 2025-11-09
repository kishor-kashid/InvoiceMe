# Swagger/OpenAPI Documentation Setup

This document provides guidance for adding Swagger/OpenAPI documentation to the InvoiceMe API.

## Overview

Swagger/OpenAPI provides interactive API documentation that allows developers to:
- Explore available endpoints
- Understand request/response formats
- Test API calls directly from the browser
- Generate client SDKs automatically

## Implementation Plan

### 1. Add Springdoc Dependency

Add to `backend/pom.xml`:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

### 2. Configure Swagger

Create `backend/src/main/java/com/invoiceme/config/SwaggerConfig.java`:

```java
package com.invoiceme.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI invoiceMeOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("InvoiceMe API")
                        .description("ERP Invoicing System REST API with DDD, CQRS, and VSA architecture")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("InvoiceMe Team")
                                .email("support@invoiceme.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt", 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT token for authentication")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }
}
```

### 3. Configure Application Properties

Add to `backend/src/main/resources/application.properties`:

```properties
# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.show-actuator=false
```

### 4. Annotate Controllers

Add Swagger annotations to controllers. Example for `CreateCustomerController`:

```java
package com.invoiceme.features.customers.createCustomer;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
@Tag(name = "Customers", description = "Customer management APIs")
@SecurityRequirement(name = "bearer-jwt")
public class CreateCustomerController {
    
    private final CreateCustomerHandler handler;
    
    public CreateCustomerController(CreateCustomerHandler handler) {
        this.handler = handler;
    }
    
    @PostMapping
    @Operation(
        summary = "Create a new customer",
        description = "Creates a new customer with the provided information. Returns the created customer ID."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Customer created successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CreateCustomerResponse.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - JWT token required"),
        @ApiResponse(responseCode = "409", description = "Customer with this email already exists")
    })
    public ResponseEntity<CreateCustomerResponse> createCustomer(
            @Valid @RequestBody CreateCustomerDto dto) {
        CreateCustomerCommand command = new CreateCustomerCommand(
            dto.name(),
            dto.email(),
            dto.phone(),
            dto.street(),
            dto.city(),
            dto.state(),
            dto.zipCode(),
            dto.country()
        );
        
        String customerId = handler.handle(command);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new CreateCustomerResponse(customerId, "Customer created successfully"));
    }
}
```

### 5. Annotate DTOs

Add schema documentation to DTOs. Example for `CreateCustomerDto`:

```java
package com.invoiceme.features.customers.createCustomer;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request body for creating a new customer")
public record CreateCustomerDto(
    
    @Schema(description = "Customer full name", example = "John Doe", required = true)
    @NotBlank(message = "Name is required")
    String name,
    
    @Schema(description = "Customer email address", example = "john.doe@example.com", required = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    String email,
    
    @Schema(description = "Customer phone number", example = "+1-555-0123", required = false)
    String phone,
    
    @Schema(description = "Street address", example = "123 Main St", required = false)
    String street,
    
    @Schema(description = "City", example = "Springfield", required = false)
    String city,
    
    @Schema(description = "State or province", example = "IL", required = false)
    String state,
    
    @Schema(description = "Postal/ZIP code", example = "62701", required = false)
    String zipCode,
    
    @Schema(description = "Country", example = "USA", required = false)
    String country
) {}
```

### 6. Access Swagger UI

After implementing the above, Swagger UI will be available at:

```
http://localhost:8080/swagger-ui.html
```

API documentation JSON will be available at:

```
http://localhost:8080/api-docs
```

## Example Annotations by Endpoint

### Customer Endpoints

**Tag**: `@Tag(name = "Customers", description = "Customer management APIs")`

- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers (with pagination)
- `GET /api/customers/{id}` - Get customer by ID
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Invoice Endpoints

**Tag**: `@Tag(name = "Invoices", description = "Invoice management and lifecycle APIs")`

- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - List invoices (with filters and pagination)
- `GET /api/invoices/{id}` - Get invoice by ID
- `PUT /api/invoices/{id}` - Update invoice (DRAFT only)
- `POST /api/invoices/{id}/send` - Mark invoice as sent
- `POST /api/invoices/{id}/payments` - Record payment
- `GET /api/invoices/{id}/payments` - List payments for invoice

### Payment Endpoints

**Tag**: `@Tag(name = "Payments", description = "Payment tracking and query APIs")`

- `GET /api/payments` - List all payments (with pagination)
- `GET /api/payments/{id}` - Get payment by ID

### Authentication Endpoints

**Tag**: `@Tag(name = "Authentication", description = "User authentication APIs")`  
**Security**: `@SecurityRequirement(name = "bearer-jwt")` NOT required (public endpoint)

- `POST /api/auth/login` - Login and receive JWT token

## Swagger Annotations Reference

### Common Annotations

| Annotation | Purpose | Example |
|------------|---------|---------|
| `@Tag` | Group endpoints by resource | `@Tag(name = "Customers")` |
| `@Operation` | Describe endpoint | `@Operation(summary = "Create customer")` |
| `@ApiResponse` | Document response | `@ApiResponse(responseCode = "201")` |
| `@Schema` | Document model fields | `@Schema(description = "Name")` |
| `@SecurityRequirement` | Indicate auth required | `@SecurityRequirement(name = "bearer-jwt")` |
| `@Parameter` | Document parameters | `@Parameter(description = "Customer ID")` |

### Security Configuration

For JWT authentication, add to controllers that require authentication:

```java
@SecurityRequirement(name = "bearer-jwt")
```

For public endpoints (like login), omit this annotation.

## Benefits of Swagger

1. **Interactive Documentation**: Developers can test endpoints directly
2. **Always Up-to-Date**: Generated from code, stays in sync
3. **Client Generation**: Can generate SDKs for various languages
4. **Discoverability**: Easy to explore available APIs
5. **Standardization**: OpenAPI is an industry standard

## Future Enhancements

1. **Request Examples**: Add complete request body examples
2. **Response Examples**: Add sample response bodies
3. **Error Schemas**: Document error response structures
4. **Authentication Flow**: Add OAuth2 flow documentation
5. **Pagination Documentation**: Document pagination parameters globally
6. **Versioning**: Add API versioning strategy

## Testing Swagger Setup

After implementation:

1. **Start the application**
2. **Navigate to** `http://localhost:8080/swagger-ui.html`
3. **Verify**:
   - All endpoints are visible
   - JWT authentication is configured
   - Request/response schemas are documented
   - "Try it out" functionality works

## References

- [Springdoc OpenAPI Documentation](https://springdoc.org/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

---

**Note**: Current API documentation is available in [API.md](../API.md). Swagger implementation will provide an interactive version of this documentation.

