package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserUpdateRequest {
    
    @NotBlank(message = "First name cannot be blank")
    @Size(max = 50)
    private String firstName;
    
    @NotBlank(message = "Last name cannot be blank")
    @Size(max = 50)
    private String lastName;    private String phoneNumber;
    private String dateOfBirth; // Date in format YYYY-MM-DD
    private String profileImageUrl;
    
    // Address information
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String apartment;
    
    // Billing information (может отличаться от основного адреса)
    private String billingAddress;
    private String billingCity;
    private String billingState;
    private String billingCountry;
    private String billingPostalCode;
    private String billingApartment;
    
    // Constructors
    public UserUpdateRequest() {}
    
    // Getters and Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
      public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    
    public String getBillingAddress() { return billingAddress; }
    public void setBillingAddress(String billingAddress) { this.billingAddress = billingAddress; }
    
    public String getBillingCity() { return billingCity; }
    public void setBillingCity(String billingCity) { this.billingCity = billingCity; }
    
    public String getBillingCountry() { return billingCountry; }
    public void setBillingCountry(String billingCountry) { this.billingCountry = billingCountry; }
      public String getBillingPostalCode() { return billingPostalCode; }
    public void setBillingPostalCode(String billingPostalCode) { this.billingPostalCode = billingPostalCode; }
    
    // Address getters and setters
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    
    public String getApartment() { return apartment; }
    public void setApartment(String apartment) { this.apartment = apartment; }
    
    public String getBillingState() { return billingState; }
    public void setBillingState(String billingState) { this.billingState = billingState; }
    
    public String getBillingApartment() { return billingApartment; }
    public void setBillingApartment(String billingApartment) { this.billingApartment = billingApartment; }
}
