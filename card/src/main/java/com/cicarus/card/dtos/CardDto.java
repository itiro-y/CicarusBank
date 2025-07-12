package com.cicarus.card.dtos;

import com.cicarus.card.model.CardStatus;
import java.math.BigDecimal;
import java.util.Date;

public record CardDto(
        Long id,
        Long customerId,
        String cardNumber,
        Date expiry,
        BigDecimal creditLimit,
        CardStatus status,
        String cardholderName,
        String network,
        String cardType,
        String cvvHash,
        String last4Digits
) {}