package com.sicarus.account.statement_service.service;

import com.sicarus.account.statement_service.dtos.StatementDto;
import com.sicarus.account.statement_service.dtos.StatementRequestDto;
import com.sicarus.account.statement_service.model.Statement;
import com.sicarus.account.statement_service.repository.StatementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatementService {
    private StatementRepository statementRepository;

    public StatementService(StatementRepository statementRepository) {
        this.statementRepository = statementRepository;
    }

    public List<StatementDto> findAll() {
        return statementRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public StatementDto findById(Long accountId) {
        return statementRepository.findById(accountId).map(this::toDto).orElse(null);
    }

    public List<StatementDto> findAllByCustomerId(Long accountId) {
        return statementRepository.findAllByAccountId(accountId);
    }

    public StatementDto create(StatementRequestDto statementRequestDto) {
        Statement statement = toEntity(statementRequestDto);
        Statement saved = statementRepository.save(statement);
        return toDto(saved);
    }

    public StatementDto toDto(Statement statement) {
        StatementDto dto = new StatementDto(
                statement.getId(),
                statement.getAccountId(),
                statement.getCreatedAt(),
                statement.getFormat(),
                statement.getStatus(),
                statement.getFileUrl(),
                statement.getFileName()
        );
        return dto;
    }

    public Statement toEntity(StatementRequestDto dto) {
        Statement statement = new Statement();
        statement.setAccountId(dto.accountId());
        statement.setCreatedAt(dto.createdAt());
        statement.setFormat(dto.format());
        statement.setStatus(dto.status());
        statement.setFileUrl(dto.fileUrl());
        statement.setFileName(dto.fileName());

        return statement;
    }
}
