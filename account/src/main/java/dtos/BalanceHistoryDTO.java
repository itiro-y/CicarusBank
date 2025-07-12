package dtos;

// BalanceHistoryDTO.java

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

public record BalanceHistoryDTO(
        Long id,
        BigDecimal balance,
        Date timestamp
) {}