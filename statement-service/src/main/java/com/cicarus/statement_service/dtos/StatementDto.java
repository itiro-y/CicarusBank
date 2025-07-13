package com.cicarus.statement_service.dtos;

import com.cicarus.statement_service.model.StatementFormat;
import com.cicarus.statement_service.model.StatementStatus;
import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

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
