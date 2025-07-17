package com.cicarus.investment.dtos;

import com.cicarus.investment.model.CryptoStatus;
import com.cicarus.investment.model.CryptoType;

import java.math.BigDecimal;
import java.util.Date;

public record CryptoDto(
        Long id,
        Long accountId,
        CryptoType type,
        CryptoStatus status,
        BigDecimal amountInvested,
        BigDecimal currentValue,
        BigDecimal cryptoMultiplier,
        Date startDate
) {}