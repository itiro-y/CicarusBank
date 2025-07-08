package com.sicarus.dto;

import com.sicarus.dto.AdressDto;

import java.time.LocalDate;

public class CustomerDto {
    private Long id;
    private String name;
    private String document; // CPF ou CNPJ
    private String email;
    private AdressDto address;
    private LocalDate birthDate;

    public CustomerDto() {
    }

    public CustomerDto(Long id, String name, String document, String email, AdressDto address, LocalDate birthDate) {
        this.id = id;
        this.name = name;
        this.document = document;
        this.email = email;
        this.address = address;
        this.birthDate = birthDate;
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

    public AdressDto getAddress() {
        return address;
    }

    public void setAddress(AdressDto address) {
        this.address = address;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
}
