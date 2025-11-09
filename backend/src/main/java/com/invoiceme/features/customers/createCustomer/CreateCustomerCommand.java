package com.invoiceme.features.customers.createCustomer;

/**
 * Command to create a new customer
 */
public class CreateCustomerCommand {
    private final String name;
    private final String email;
    private final String phone;
    private final String street;
    private final String city;
    private final String state;
    private final String zipCode;
    private final String country;
    
    public CreateCustomerCommand(String name, String email, String phone,
                                String street, String city, String state,
                                String zipCode, String country) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
    }
    
    public String getName() {
        return name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public String getStreet() {
        return street;
    }
    
    public String getCity() {
        return city;
    }
    
    public String getState() {
        return state;
    }
    
    public String getZipCode() {
        return zipCode;
    }
    
    public String getCountry() {
        return country;
    }
}

