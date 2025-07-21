package com.cicarus.investment.dtos.crypto;

import com.cicarus.investment.model.crypto.CryptoStatus;
import com.cicarus.investment.model.crypto.CryptoType;

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