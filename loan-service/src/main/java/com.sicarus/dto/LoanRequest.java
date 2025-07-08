package com.sicarus.dto;

import java.math.BigDecimal;

public record LoanRequest(
        Long customerId,
        BigDecimal amount,
        Integer termMonths,
        BigDecimal interestRate
) {}
