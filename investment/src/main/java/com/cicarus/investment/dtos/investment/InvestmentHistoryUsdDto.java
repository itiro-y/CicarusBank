package com.cicarus.investment.dtos.investment;

import java.math.BigDecimal;
import java.util.Date;

public record InvestmentHistoryUsdDto(
        BigDecimal sumOfAllUsdInvestments,
        Date dateOfLastInvestment
) {}
