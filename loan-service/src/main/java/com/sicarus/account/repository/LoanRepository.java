package com.sicarus.account.repository;

import com.sicarus.account.model.Loan;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    @EntityGraph(attributePaths = "installments")
    List<Loan> findByCustomerId(Long customerId);
}
