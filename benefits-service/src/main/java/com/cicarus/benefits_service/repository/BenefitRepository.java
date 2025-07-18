package com.cicarus.benefits_service.repository;

import com.cicarus.benefits_service.entities.Benefit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BenefitRepository extends JpaRepository<Benefit, Long> {
    Optional<Benefit> findByName(String name);
    List<Benefit> findByActiveTrue(); 
}