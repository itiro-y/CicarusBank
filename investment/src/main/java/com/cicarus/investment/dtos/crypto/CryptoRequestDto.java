package com.cicarus.investment.dtos.crypto;

import com.cicarus.investment.model.crypto.CryptoStatus;
import com.cicarus.investment.model.crypto.CryptoType;
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
        BigDecimal amountInvested,

        @NotNull
        BigDecimal currentValue,

        @NotNull
        BigDecimal cryptoMultiplier
) {}