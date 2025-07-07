package com.cicarus.customer_service.dto;

import com.cicarus.customer_service.entities.Address;

import java.time.LocalDate;

public class CustomerResponse {
    private Long id;
    private String name;
    private String document;
    private String email;
    private LocalDate birthDate;
    private Address address;
}
