package com.cicarus.card.dtos;

import com.cicarus.card.model.CardStatus;
import jakarta.validation.constraints.NotNull;

public record CardStatusRequestDto(
        @NotNull Long cardId,
        @NotNull CardStatus newStatus
) {
}