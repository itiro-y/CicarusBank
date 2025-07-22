package dtos;


import java.math.BigDecimal;
import java.util.List;

public record AccountDTO(
        Long   id,
        Long   userId,
        String type,
        BigDecimal balance,
        BigDecimal usdWallet,
        BigDecimal eurWallet,
        List<BalanceHistoryDTO> history
) {}