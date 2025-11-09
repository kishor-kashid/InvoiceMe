package com.invoiceme.domain.invoice;

import com.invoiceme.domain.customer.CustomerId;
import com.invoiceme.domain.shared.Money;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Invoice Aggregate Root
 * Manages the invoice lifecycle: DRAFT → SENT → PAID
 */
@Entity
@Table(name = "invoices")
public class Invoice {
    
    @EmbeddedId
    private InvoiceId id;
    
    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "customer_id", nullable = false))
    private CustomerId customerId;
    
    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status;
    
    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;
    
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "invoice_id", nullable = false)
    private List<LineItem> lineItems = new ArrayList<>();
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "amount", column = @Column(name = "total_amount")),
        @AttributeOverride(name = "currency", column = @Column(name = "currency"))
    })
    private Money totalAmount;
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "amount", column = @Column(name = "paid_amount")),
        @AttributeOverride(name = "currency", column = @Column(name = "paid_currency"))
    })
    private Money paidAmount;
    
    @Column(name = "notes", length = 1000)
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    // Required for JPA
    protected Invoice() {
    }
    
    public Invoice(InvoiceId id, CustomerId customerId, String invoiceNumber, 
                   LocalDate issueDate, LocalDate dueDate, String currency) {
        if (id == null) {
            throw new IllegalArgumentException("Invoice ID cannot be null");
        }
        if (customerId == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        if (invoiceNumber == null || invoiceNumber.isBlank()) {
            throw new IllegalArgumentException("Invoice number cannot be null or empty");
        }
        if (issueDate == null) {
            throw new IllegalArgumentException("Issue date cannot be null");
        }
        if (dueDate == null) {
            throw new IllegalArgumentException("Due date cannot be null");
        }
        if (dueDate.isBefore(issueDate)) {
            throw new IllegalArgumentException("Due date cannot be before issue date");
        }
        
        this.id = id;
        this.customerId = customerId;
        this.invoiceNumber = invoiceNumber.trim();
        this.status = InvoiceStatus.DRAFT;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.totalAmount = Money.zero(currency);
        this.paidAmount = Money.zero(currency);
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public static Invoice create(CustomerId customerId, String invoiceNumber, 
                                LocalDate issueDate, LocalDate dueDate, String currency) {
        return new Invoice(InvoiceId.generate(), customerId, invoiceNumber, 
                         issueDate, dueDate, currency);
    }
    
    // Business methods
    
    /**
     * Add a line item to the invoice
     * Can only be done in DRAFT status
     */
    public void addLineItem(LineItem lineItem) {
        if (!status.canBeEdited()) {
            throw new IllegalStateException("Cannot add line items to invoice in " + status + " status");
        }
        if (lineItem == null) {
            throw new IllegalArgumentException("Line item cannot be null");
        }
        
        lineItem.setInvoice(this);
        this.lineItems.add(lineItem);
        recalculateTotal();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Remove a line item from the invoice
     * Can only be done in DRAFT status
     */
    public void removeLineItem(String lineItemId) {
        if (!status.canBeEdited()) {
            throw new IllegalStateException("Cannot remove line items from invoice in " + status + " status");
        }
        
        this.lineItems.removeIf(item -> item.getId().equals(lineItemId));
        recalculateTotal();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Update invoice details
     * Can only be done in DRAFT status
     */
    public void updateDetails(LocalDate issueDate, LocalDate dueDate, String notes) {
        if (!status.canBeEdited()) {
            throw new IllegalStateException("Cannot update invoice in " + status + " status");
        }
        
        if (issueDate != null) {
            this.issueDate = issueDate;
        }
        if (dueDate != null) {
            if (dueDate.isBefore(this.issueDate)) {
                throw new IllegalArgumentException("Due date cannot be before issue date");
            }
            this.dueDate = dueDate;
        }
        if (notes != null) {
            this.notes = notes.trim();
        }
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Mark the invoice as sent
     * Transition: DRAFT → SENT
     */
    public void markAsSent() {
        if (status != InvoiceStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT invoices can be marked as SENT");
        }
        if (lineItems.isEmpty()) {
            throw new IllegalStateException("Cannot send an invoice with no line items");
        }
        
        this.status = InvoiceStatus.SENT;
        this.sentAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Apply a payment to the invoice
     * Can only be done in SENT status
     */
    public void applyPayment(Money paymentAmount) {
        if (!status.canAcceptPayments()) {
            throw new IllegalStateException("Cannot apply payment to invoice in " + status + " status");
        }
        if (paymentAmount == null) {
            throw new IllegalArgumentException("Payment amount cannot be null");
        }
        
        Money remainingBalance = calculateBalance();
        if (paymentAmount.isGreaterThan(remainingBalance)) {
            throw new IllegalArgumentException("Payment amount exceeds invoice balance");
        }
        
        this.paidAmount = this.paidAmount.add(paymentAmount);
        this.updatedAt = LocalDateTime.now();
        
        // Automatically mark as PAID if fully paid
        if (calculateBalance().isZero()) {
            this.status = InvoiceStatus.PAID;
        }
    }
    
    /**
     * Calculate the total invoice amount from line items
     */
    private void recalculateTotal() {
        Money total = Money.zero(totalAmount.getCurrency());
        for (LineItem item : lineItems) {
            total = total.add(item.calculateTotal());
        }
        this.totalAmount = total;
    }
    
    /**
     * Calculate the remaining balance
     */
    public Money calculateBalance() {
        return totalAmount.subtract(paidAmount);
    }
    
    /**
     * Check if the invoice is fully paid
     */
    public boolean isFullyPaid() {
        return calculateBalance().isZero();
    }
    
    /**
     * Check if the invoice is overdue
     */
    public boolean isOverdue() {
        return status == InvoiceStatus.SENT && 
               LocalDate.now().isAfter(dueDate) && 
               !isFullyPaid();
    }
    
    // Getters
    public InvoiceId getId() {
        return id;
    }
    
    public CustomerId getCustomerId() {
        return customerId;
    }
    
    public String getInvoiceNumber() {
        return invoiceNumber;
    }
    
    public InvoiceStatus getStatus() {
        return status;
    }
    
    public LocalDate getIssueDate() {
        return issueDate;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public List<LineItem> getLineItems() {
        return Collections.unmodifiableList(lineItems);
    }
    
    public Money getTotalAmount() {
        return totalAmount;
    }
    
    public Money getPaidAmount() {
        return paidAmount;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public LocalDateTime getSentAt() {
        return sentAt;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Invoice invoice = (Invoice) o;
        return Objects.equals(id, invoice.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Invoice{" +
                "id=" + id +
                ", invoiceNumber='" + invoiceNumber + '\'' +
                ", status=" + status +
                ", totalAmount=" + totalAmount +
                ", balance=" + calculateBalance() +
                '}';
    }
}

