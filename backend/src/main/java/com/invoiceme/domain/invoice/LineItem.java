package com.invoiceme.domain.invoice;

import com.invoiceme.domain.shared.Money;
import jakarta.persistence.*;
import java.util.Objects;
import java.util.UUID;

/**
 * Entity representing a line item in an invoice
 */
@Entity
@Table(name = "line_items")
public class LineItem {
    
    @Id
    @Column(name = "id")
    private String id;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private int quantity;
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "amount", column = @Column(name = "unit_price")),
        @AttributeOverride(name = "currency", column = @Column(name = "currency"))
    })
    private Money unitPrice;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", insertable = false, updatable = false)
    private Invoice invoice;
    
    // Required for JPA
    protected LineItem() {
    }
    
    public LineItem(String description, int quantity, Money unitPrice) {
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Line item description cannot be null or empty");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        if (unitPrice == null) {
            throw new IllegalArgumentException("Unit price cannot be null");
        }
        
        this.id = UUID.randomUUID().toString();
        this.description = description.trim();
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }
    
    /**
     * Calculate the total amount for this line item
     */
    public Money calculateTotal() {
        return unitPrice.multiply(quantity);
    }
    
    /**
     * Update the line item details
     */
    public void update(String description, int quantity, Money unitPrice) {
        if (description != null && !description.isBlank()) {
            this.description = description.trim();
        }
        if (quantity > 0) {
            this.quantity = quantity;
        }
        if (unitPrice != null) {
            this.unitPrice = unitPrice;
        }
    }
    
    // Package-private setter for invoice relationship
    void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }
    
    // Getters
    public String getId() {
        return id;
    }
    
    public String getDescription() {
        return description;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public Money getUnitPrice() {
        return unitPrice;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LineItem lineItem = (LineItem) o;
        return Objects.equals(id, lineItem.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "LineItem{" +
                "description='" + description + '\'' +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                ", total=" + calculateTotal() +
                '}';
    }
}

