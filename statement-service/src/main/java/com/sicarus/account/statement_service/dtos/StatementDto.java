package com.sicarus.account.statement_service.dtos;

import com.sicarus.account.statement_service.model.StatementFormat;
import com.sicarus.account.statement_service.model.StatementStatus;

import java.util.Date;

public record StatementDto(
        Long id,
        Long accountId,
        Date createdAt,
        StatementFormat format,
        StatementStatus status,
        String fileUrl,
        String fileName
) {
}
