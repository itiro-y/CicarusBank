package com.cicarus.investment.model.account;

import java.math.BigDecimal;

public record AccountDto(
        Long id,
        Long userId,
        AccountType type,
        BigDecimal balance,
        BigDecimal usdWallet,
        BigDecimal eurWallet
) {}