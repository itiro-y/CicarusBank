package com.sicarus.dto;

import com.sicarus.model.LoanStatus;

import java.math.BigDecimal;

public record LoanResponse(
        Long id,
        Long customerId,
        BigDecimal amount,
        Integer termMonths,
        BigDecimal interestRate,
        LoanStatus status,
        java.time.Instant createdAt
) {}