package com.cicarus.currency_exchange.service;

import com.cicarus.currency_exchange.client.AccountServiceClient;
import com.cicarus.currency_exchange.domain.ExchangeRate;
import com.cicarus.currency_exchange.dto.*;
import com.cicarus.currency_exchange.exception.CurrencyNotSupportedException;
import com.cicarus.currency_exchange.repository.ExchangeRateRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ExchangeService {
    private final ExchangeRateRepository repository;
    private final AccountServiceClient accountServiceClient;

    public ExchangeService(ExchangeRateRepository repository, AccountServiceClient accountServiceClient) {
        this.repository = repository;
        this.accountServiceClient = accountServiceClient;
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

    public ConvertBrlToUsdResponse convertBrlToUsd(ConvertBrlToUsdRequest request) {
        BigDecimal brlToUsdRate = getRate("BRL", "USD");
        BigDecimal convertedUsdAmount = request.getAmount().multiply(brlToUsdRate);

        UpdateAccountBalancesRequest updateRequest = new UpdateAccountBalancesRequest();
        updateRequest.setAccountId(request.getAccountId());
        updateRequest.setBrlAmount(request.getAmount());
        updateRequest.setUsdAmount(convertedUsdAmount);

        accountServiceClient.updateAccountBalances(updateRequest);

        return new ConvertBrlToUsdResponse(request.getAmount(), convertedUsdAmount, brlToUsdRate);
    }

    public ConvertBrlToEurResponse convertBrlToEur(ConvertBrlToEurRequest request) {
        BigDecimal brlToEurRate = getRate("BRL", "EUR");
        BigDecimal convertedEurAmount = request.getAmount().multiply(brlToEurRate);

        UpdateAccountBrlToEurRequest updateRequest = new UpdateAccountBrlToEurRequest();
        updateRequest.setAccountId(request.getAccountId());
        updateRequest.setBrlAmount(request.getAmount());
        updateRequest.setEurAmount(convertedEurAmount);

        accountServiceClient.updateAccountBrlToEur(updateRequest);

        return new ConvertBrlToEurResponse(request.getAmount(), convertedEurAmount, brlToEurRate);
    }
}

