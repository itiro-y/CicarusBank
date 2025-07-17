package com.cicarus.investment.dtos.investment;

import com.cicarus.investment.model.investment.InvestmentStatus;
import com.cicarus.investment.model.investment.InvestmentType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.Date;

public record InvestmentRequestDto(
        @NotNull Long id,
        @NotNull Long accountId,
        @NotNull InvestmentType type,
        @NotNull InvestmentStatus status,
        @NotEmpty @Positive BigDecimal amountInvested,
        @NotEmpty BigDecimal currentValue,
        @NotEmpty @DecimalMin("0.0") BigDecimal expectedReturnRate,
        @NotNull @PastOrPresent Date startDate,
        @NotNull @FutureOrPresent Date endDate,
        @NotEmpty Boolean autoRenew
) {}

