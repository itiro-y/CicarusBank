package com.cicarus.statement_service.service;

import com.cicarus.statement_service.repository.StatementRepository;
import org.springframework.stereotype.Service;

@Service
public class StatementService {
    private StatementRepository statementRepository;

    public StatementService(StatementRepository statementRepository) {
        this.statementRepository = statementRepository;
    }


}
