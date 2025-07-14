package com.sicarus.statement_service.dtos;

import java.math.BigDecimal;
import java.util.Date;

public record TransactionDto(
        Long id,
        Long accountId,
        TransactionType transactionType,
        BigDecimal amount,
        Date timestamp,
        TransactionStatus transactionStatus
) {}
