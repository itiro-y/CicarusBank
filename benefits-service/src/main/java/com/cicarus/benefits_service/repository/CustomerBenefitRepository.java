package com.cicarus.benefits_service.repository;

import com.cicarus.benefits_service.entities.CustomerBenefit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerBenefitRepository extends JpaRepository<CustomerBenefit, Long> {
    List<CustomerBenefit> findByCustomerId(Long customerId);
    Optional<CustomerBenefit> findByCustomerIdAndBenefitId(Long customerId, Long benefitId);
    List<CustomerBenefit> findByCustomerIdAndActivatedTrue(Long customerId);
}