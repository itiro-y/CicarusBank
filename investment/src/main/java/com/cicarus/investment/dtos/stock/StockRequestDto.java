package com.cicarus.investment.dtos.stock;

import com.cicarus.investment.model.stock.StockCurrencyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.util.Date;

public record StockRequestDto(
        @NotBlank String symbol,
        @NotNull Long accountId,
        @NotBlank String companyName,
        @NotNull StockCurrencyType currency,
        @NotBlank String setor,
        @NotNull BigDecimal currentPrice,
        @NotNull BigDecimal volume,
        @NotNull BigDecimal marketCap,
        @NotNull BigDecimal peRatio,
        @NotNull BigDecimal dividendYield
) {}