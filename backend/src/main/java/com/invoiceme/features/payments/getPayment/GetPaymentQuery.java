package com.invoiceme.features.payments.getPayment;

/**
 * Query to get a payment by ID
 */
public class GetPaymentQuery {
    private final String paymentId;
    
    public GetPaymentQuery(String paymentId) {
        this.paymentId = paymentId;
    }
    
    public String getPaymentId() {
        return paymentId;
    }
}

