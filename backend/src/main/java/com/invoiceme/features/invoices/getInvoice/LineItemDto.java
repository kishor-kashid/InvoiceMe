package com.invoiceme.features.invoices.getInvoice;

/**
 * DTO for line item read model
 */
public class LineItemDto {
    private String id;
    private String description;
    private int quantity;
    private InvoiceDto.MoneyDto unitPrice;
    private InvoiceDto.MoneyDto total;
    
    public LineItemDto() {
    }
    
    public LineItemDto(String id, String description, int quantity,
                      InvoiceDto.MoneyDto unitPrice, InvoiceDto.MoneyDto total) {
        this.id = id;
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.total = total;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    
    public InvoiceDto.MoneyDto getUnitPrice() {
        return unitPrice;
    }
    
    public void setUnitPrice(InvoiceDto.MoneyDto unitPrice) {
        this.unitPrice = unitPrice;
    }
    
    public InvoiceDto.MoneyDto getTotal() {
        return total;
    }
    
    public void setTotal(InvoiceDto.MoneyDto total) {
        this.total = total;
    }
}

