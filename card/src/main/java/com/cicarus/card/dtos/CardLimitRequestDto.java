package com.cicarus.card.dtos;

import java.math.BigDecimal;

public record CardLimitRequestDto(Long cardId, BigDecimal newLimit) {
}

