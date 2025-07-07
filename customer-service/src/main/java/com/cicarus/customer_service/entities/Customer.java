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
    private String document; // CPF ou CNPJ
    private String email;

    @Embedded
    private Address address;
    private LocalDate birthDate;
}
