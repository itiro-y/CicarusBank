package com.cicarus.investment.dtos.stock;

import com.cicarus.investment.model.stock.StockCurrencyType;

import java.math.BigDecimal;
import java.util.Date;

public record StockDto(
        Long id,
        Long accountId,
        String symbol,
        String companyName,
        StockCurrencyType currency,
        String setor,
        BigDecimal currentPrice,
        Date tradeTime,
        BigDecimal volume,
        BigDecimal marketCap,
        BigDecimal peRatio,
        BigDecimal dividendYield
) {}