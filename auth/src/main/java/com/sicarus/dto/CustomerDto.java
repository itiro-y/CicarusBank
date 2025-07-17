package com.sicarus.dto;

import java.time.LocalDate;

public class CustomerDto {
    private String name;
    private Long id;
    private String document;
    private String email;
    private String password;
    private LocalDate birthDate;
    private String street;
    private String city;
    private String state;
    private String zipCode;

    public CustomerDto() {
    }

    public CustomerDto(String name, Long id, String document, String email, String password, LocalDate birthDate, String street, String city, String state, String zipCode) {
        this.name = name;
        this.id = id;
        this.document = document;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
}
