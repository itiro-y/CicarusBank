package com.cicarus.investment.dtos.investment;

import com.cicarus.investment.model.investment.InvestmentStatus;
import com.cicarus.investment.model.investment.InvestmentType;

import java.math.BigDecimal;
import java.util.Date;

public record InvestmentDto(
        Long id,
        Long accountId,
        InvestmentType type,
        InvestmentStatus status,
        BigDecimal amountInvested,
        BigDecimal currentValue,
        BigDecimal expectedReturnRate,
        Date startDate,
        Date endDate,
        Boolean autoRenew
) {}
