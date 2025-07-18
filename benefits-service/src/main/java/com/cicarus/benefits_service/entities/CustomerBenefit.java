package com.cicarus.benefits_service.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "customer_benefits")
public class CustomerBenefit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long customerId; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "benefit_id", nullable = false)
    private Benefit benefit; 

    private LocalDate activationDate;
    private LocalDate expirationDate; 
    private boolean activated; 

    public CustomerBenefit() {
    }

    public CustomerBenefit(Long id, Long customerId, Benefit benefit, LocalDate activationDate, LocalDate expirationDate, boolean activated) {
        this.id = id;
        this.customerId = customerId;
        this.benefit = benefit;
        this.activationDate = activationDate;
        this.expirationDate = expirationDate;
        this.activated = activated;
    }

    
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

    public Benefit getBenefit() {
        return benefit;
    }

    public void setBenefit(Benefit benefit) {
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