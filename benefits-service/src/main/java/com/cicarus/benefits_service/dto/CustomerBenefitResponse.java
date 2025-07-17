package com.cicarus.benefits_service.dto;

import java.time.LocalDate;

public class CustomerBenefitResponse {
    private Long id;
    private Long customerId;
    private BenefitResponse benefit; // Retorna o DTO do benefício completo
    private LocalDate activationDate;
    private LocalDate expirationDate;
    private boolean activated;

    public CustomerBenefitResponse() {
    }

    public CustomerBenefitResponse(Long id, Long customerId, BenefitResponse benefit, LocalDate activationDate, LocalDate expirationDate, boolean activated) {
        this.id = id;
        this.customerId = customerId;
        this.benefit = benefit;
        this.activationDate = activationDate;
        this.expirationDate = expirationDate;
        this.activated = activated;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public BenefitResponse getBenefit() {
        return benefit;
    }

    public void setBenefit(BenefitResponse benefit) {
        this.benefit = benefit;
    }

    public LocalDate getActivationDate() {
        return activationDate;
    }

    public void setActivationDate(LocalDate activationDate) {
        this.activationDate = activationDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }
}