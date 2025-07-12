package com.cicarus.card.dtos;

import com.cicarus.card.model.CardStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.Date;

public record CardRequestDto(
        @NotNull Long customerId,
        @NotBlank @Size(min = 13, max = 19) String cardNumber,
        @NotNull Date expiry,
        @NotNull @DecimalMin("0.0") BigDecimal creditLimit,
        @NotNull CardStatus status,
        @NotBlank String cardholderName,
        @NotBlank String network,
        @NotBlank String cardType,
        @NotBlank String cvvHash,
        @NotBlank String last4Digits
) {
}
