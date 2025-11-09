package com.invoiceme.shared.exceptions;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Error response for validation failures
 */
public class ValidationErrorResponse extends ErrorResponse {
    private Map<String, String> fieldErrors;
    
    public ValidationErrorResponse(int status, String message, LocalDateTime timestamp, Map<String, String> fieldErrors) {
        super(status, message, timestamp);
        this.fieldErrors = fieldErrors;
    }
    
    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}

