package com.sicarus.repository;

import com.sicarus.model.Loan;
import com.sicarus.model.LoanStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    @EntityGraph(attributePaths = "installments")
    List<Loan> findByCustomerId(Long customerId);

    List<Loan> findByStatus(LoanStatus status);
}
