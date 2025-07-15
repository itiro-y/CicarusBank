package com.cicarus.benefits_service.dto;

import com.cicarus.benefits_service.entities.BenefitType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BenefitRequest {
    private String name;
    private String description;
    private BenefitType type;
    private BigDecimal value;
    private LocalDate validUntil;
    private boolean active;

    public BenefitRequest() {
    }

    public BenefitRequest(String name, String description, BenefitType type, BigDecimal value, LocalDate validUntil, boolean active) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.value = value;
        this.validUntil = validUntil;
        this.active = active;
    }

    // Getters e Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BenefitType getType() {
        return type;
    }

    public void setType(BenefitType type) {
        this.type = type;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}