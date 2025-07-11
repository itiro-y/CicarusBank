package dtos;// AccountDTO.java


import java.math.BigDecimal;
import java.util.List;

public record AccountDTO(
        Long   id,
        Long   userId,
        String type,
        BigDecimal balance,
        List<BalanceHistoryDTO> history
) {}