package com.cicarus.investment.dtos.investment;

import java.math.BigDecimal;
import java.util.Date;

public record InvestmentHistoryBrlDto(
        BigDecimal sumOfAllBrlInvestments,
        Date dateOfLastInvestment
) {}