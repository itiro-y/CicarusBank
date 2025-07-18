package com.cicarus.benefits_service.service;

import com.cicarus.benefits_service.dto.BenefitRequest;
import com.cicarus.benefits_service.dto.BenefitResponse;
import com.cicarus.benefits_service.dto.CustomerBenefitRequest;
import com.cicarus.benefits_service.dto.CustomerBenefitResponse;
import com.cicarus.benefits_service.entities.Benefit;
import com.cicarus.benefits_service.entities.CustomerBenefit;
import com.cicarus.benefits_service.repository.BenefitRepository;
import com.cicarus.benefits_service.repository.CustomerBenefitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BenefitService {

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private CustomerBenefitRepository customerBenefitRepository;

    

    @Transactional
    public BenefitResponse createBenefit(BenefitRequest request) {
        Benefit benefit = new Benefit();
        benefit.setName(request.getName());
        benefit.setDescription(request.getDescription());
        benefit.setType(request.getType());
        benefit.setValue(request.getValue());
        benefit.setValidUntil(request.getValidUntil());
        benefit.setActive(request.isActive());
        benefit = benefitRepository.save(benefit);
        return convertToBenefitResponse(benefit);
    }

    @Transactional(readOnly = true)
    public BenefitResponse getBenefitById(Long id) {
        Benefit benefit = benefitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Benefit not found with id: " + id)); 
        return convertToBenefitResponse(benefit);
    }

    @Transactional(readOnly = true)
    public List<BenefitResponse> getAllBenefits() {
        return benefitRepository.findAll().stream()
                .map(this::convertToBenefitResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BenefitResponse> getActiveBenefits() {
        return benefitRepository.findByActiveTrue().stream()
                .map(this::convertToBenefitResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BenefitResponse updateBenefit(Long id, BenefitRequest request) {
        Benefit benefit = benefitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Benefit not found with id: " + id));

        benefit.setName(request.getName());
        benefit.setDescription(request.getDescription());
        benefit.setType(request.getType());
        benefit.setValue(request.getValue());
        benefit.setValidUntil(request.getValidUntil());
        benefit.setActive(request.isActive());
        benefit = benefitRepository.save(benefit);
        return convertToBenefitResponse(benefit);
    }

    @Transactional
    public void deleteBenefit(Long id) {
        if (!benefitRepository.existsById(id)) {
            throw new RuntimeException("Benefit not found with id: " + id);
        }
        benefitRepository.deleteById(id);
    }

    

    @Transactional
    public CustomerBenefitResponse activateBenefitForCustomer(CustomerBenefitRequest request) {
        
        Benefit benefit = benefitRepository.findById(request.getBenefitId())
                .orElseThrow(() -> new RuntimeException("Benefit not found with id: " + request.getBenefitId()));

        
        Optional<CustomerBenefit> existingCustomerBenefit = customerBenefitRepository.findByCustomerIdAndBenefitId(request.getCustomerId(), request.getBenefitId());

        if (existingCustomerBenefit.isPresent()) {
            CustomerBenefit cb = existingCustomerBenefit.get();
            
            if (!cb.isActivated() || (request.isActivated() && cb.getExpirationDate() != null && cb.getExpirationDate().isBefore(LocalDate.now()))) {
                cb.setActivated(true);
                cb.setActivationDate(LocalDate.now());
                cb.setExpirationDate(request.getExpirationDate()); 
                cb = customerBenefitRepository.save(cb);
                return convertToCustomerBenefitResponse(cb);
            } else {
                throw new RuntimeException("Customer already has this benefit activated.");
            }
        } else {
            CustomerBenefit customerBenefit = new CustomerBenefit();
            customerBenefit.setCustomerId(request.getCustomerId());
            customerBenefit.setBenefit(benefit);
            customerBenefit.setActivationDate(LocalDate.now());
            customerBenefit.setExpirationDate(request.getExpirationDate());
            customerBenefit.setActivated(request.isActivated());
            customerBenefit = customerBenefitRepository.save(customerBenefit);
            return convertToCustomerBenefitResponse(customerBenefit);
        }
    }

    @Transactional
    public CustomerBenefitResponse deactivateBenefitForCustomer(Long customerBenefitId) {
        CustomerBenefit customerBenefit = customerBenefitRepository.findById(customerBenefitId)
                .orElseThrow(() -> new RuntimeException("Customer Benefit not found with id: " + customerBenefitId));
        customerBenefit.setActivated(false); 
        customerBenefit = customerBenefitRepository.save(customerBenefit);
        return convertToCustomerBenefitResponse(customerBenefit);
    }

    @Transactional(readOnly = true)
    public List<CustomerBenefitResponse> getCustomerBenefits(Long customerId) {
        return customerBenefitRepository.findByCustomerId(customerId).stream()
                .map(this::convertToCustomerBenefitResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CustomerBenefitResponse> getCustomerActiveBenefits(Long customerId) {
        return customerBenefitRepository.findByCustomerIdAndActivatedTrue(customerId).stream()
                .filter(cb -> cb.getExpirationDate() == null || cb.getExpirationDate().isAfter(LocalDate.now()))
                .map(this::convertToCustomerBenefitResponse)
                .collect(Collectors.toList());
    }


    

    private BenefitResponse convertToBenefitResponse(Benefit benefit) {
        return new BenefitResponse(
                benefit.getId(),
                benefit.getName(),
                benefit.getDescription(),
                benefit.getType(),
                benefit.getValue(),
                benefit.getValidUntil(),
                benefit.isActive()
        );
    }

    private CustomerBenefitResponse convertToCustomerBenefitResponse(CustomerBenefit customerBenefit) {
        return new CustomerBenefitResponse(
                customerBenefit.getId(),
                customerBenefit.getCustomerId(),
                convertToBenefitResponse(customerBenefit.getBenefit()), 
                customerBenefit.getActivationDate(),
                customerBenefit.getExpirationDate(),
                customerBenefit.isActivated()
        );
    }
}