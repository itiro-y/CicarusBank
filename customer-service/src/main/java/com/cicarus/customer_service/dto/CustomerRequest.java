package com.cicarus.customer_service.dto;
import com.cicarus.customer_service.entities.Address;

import java.time.LocalDate;

public class CustomerRequest {
    private String name;
    private String document;
    private String email;
    private LocalDate birthDate;
    private Address address;

    public CustomerRequest() {
    }

    public CustomerRequest(String name, String document, String email, LocalDate birthDate, Address address) {
        this.name = name;
        this.document = document;
        this.email = email;
        this.birthDate = birthDate;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDocument() {
        return document;
    }

    public void setDocument(String document) {
        this.document = document;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }
}