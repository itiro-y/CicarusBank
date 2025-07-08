package com.cicarus.currency_exchange.service;

import com.cicarus.currency_exchange.domain.ExchangeRate;
import com.cicarus.currency_exchange.dto.ConvertRequest;
import com.cicarus.currency_exchange.dto.ConvertResponse;
import com.cicarus.currency_exchange.exception.CurrencyNotSupportedException;
import com.cicarus.currency_exchange.repository.ExchangeRateRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ExchangeService {
    private final ExchangeRateRepository repository;

    public ExchangeService(ExchangeRateRepository repository) {
        this.repository = repository;
    }
    public BigDecimal getRate(String from, String to) {
        return repository.findTopByFromCurrencyAndToCurrencyOrderByUpdatedAtDesc(from, to)
                .map(ExchangeRate::getRate)
                .orElseThrow(() -> new CurrencyNotSupportedException(from, to));
    }

    public ConvertResponse convert(ConvertRequest req) {
        BigDecimal rate = getRate(req.getFrom(), req.getTo());
        BigDecimal result = req.getAmount().multiply(rate);
        return new ConvertResponse(req.getFrom(), req.getTo(), rate, req.getAmount(), result);
    }
}

