package com.sicarus.statement_service.dtos;

import com.sicarus.statement_service.model.StatementFormat;
import com.sicarus.statement_service.model.StatementStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;


import java.util.Date;

public record StatementRequestDto(
        @NotNull Long accountId,
        @NotNull @PastOrPresent Date createdAt,
        @NotNull StatementFormat format,
        @NotNull StatementStatus status,
        @NotBlank String fileUrl,
        @NotBlank String fileName
) {}
