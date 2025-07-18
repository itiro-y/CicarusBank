package com.cicarus.customer_service.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String document; 
    private String email;
    private String password;

    @Embedded
    private Address address;
    private LocalDate birthDate;

    public Customer() {
    }

    public Customer(Long id, String name, String document, String email, String password, Address address, LocalDate birthDate) {
        this.id = id;
        this.name = name;
        this.document = document;
        this.email = email;
        this.password = password;
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

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
