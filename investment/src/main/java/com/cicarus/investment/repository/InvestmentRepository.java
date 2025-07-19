package com.cicarus.investment.repository;

import com.cicarus.investment.model.investment.Investment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findAllByAccountId(Long id);
}
