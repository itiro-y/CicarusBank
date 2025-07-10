package com.cicarus.customer_service.dto;

import com.cicarus.customer_service.entities.Address;

import java.time.LocalDate;

public class CustomerResponse {
    private Long id;
    private String name;
    private String document;
    private String email;
    private String password;
    private LocalDate birthDate;
    private Address address;

    public CustomerResponse() {
    }

    public CustomerResponse(Long id, String name, String document, String email, String password, LocalDate birthDate, Address address) {
        this.id = id;
        this.name = name;
        this.document = document;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
        this.address = address;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
