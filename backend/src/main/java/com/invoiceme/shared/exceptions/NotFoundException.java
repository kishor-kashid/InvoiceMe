package com.invoiceme.shared.exceptions;

/**
 * Exception thrown when a requested resource is not found
 */
public class NotFoundException extends RuntimeException {
    
    public NotFoundException(String message) {
        super(message);
    }
    
    public NotFoundException(String resourceType, String id) {
        super(String.format("%s with ID '%s' not found", resourceType, id));
    }
}

