package com.sicarus.dto;

import java.math.BigDecimal;

public record SimulateLoanRequest(
        BigDecimal principal,
        int termMonths,
        BigDecimal interestRate // Ex: 0.019 para 1.9% ao mês
) {}