package com.cicarus.currency_exchange.repository;

import com.cicarus.currency_exchange.domain.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
    Optional<ExchangeRate> findTopByFromCurrencyAndToCurrencyOrderByUpdatedAtDesc(String from, String to);
}
