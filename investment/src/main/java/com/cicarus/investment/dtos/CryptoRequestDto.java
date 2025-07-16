package com.cicarus.investment.dtos;

import com.cicarus.investment.model.CryptoStatus;
import com.cicarus.investment.model.CryptoType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.util.Date;

public record CryptoRequestDto(
        @NotNull
        Long accountId,

        @NotNull
        CryptoType type,

        @NotNull
        CryptoStatus status,

        @NotNull
        @DecimalMin("0.0")
        BigDecimal amountInvested,

        @NotNull
        BigDecimal currentValue,

        @NotNull
        BigDecimal cryptoMultiplier,

        @NotNull
        @PastOrPresent
        Date startDate
) {}