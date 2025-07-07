package com.sicarus.dto;

import java.math.BigDecimal;

public record InstallmentDTO(
        int installmentNumber,
        BigDecimal amount,
        BigDecimal interest,
        BigDecimal amortization,
        BigDecimal remainingPrincipal
) {}