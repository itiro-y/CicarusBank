package com.sicarus.statement_service.repository;

import com.sicarus.statement_service.dtos.StatementDto;
import com.sicarus.statement_service.model.Statement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatementRepository extends JpaRepository<Statement, Long> {
    List<StatementDto> findAllByAccountId(Long accountId);
}
