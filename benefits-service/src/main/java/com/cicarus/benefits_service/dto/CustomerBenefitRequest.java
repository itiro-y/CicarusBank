package com.cicarus.benefits_service.dto;

import java.time.LocalDate;

public class CustomerBenefitRequest {
    private Long customerId;
    private Long benefitId;
    private LocalDate expirationDate; // Pode ser nulo
    private boolean activated;

    public CustomerBenefitRequest() {
    }

    public CustomerBenefitRequest(Long customerId, Long benefitId, LocalDate expirationDate, boolean activated) {
        this.customerId = customerId;
        this.benefitId = benefitId;
        this.expirationDate = expirationDate;
        this.activated = activated;
    }

    // Getters e Setters
    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getBenefitId() {
        return benefitId;
    }

    public void setBenefitId(Long benefitId) {
        this.benefitId = benefitId;
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