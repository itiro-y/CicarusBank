package com.cicarus.currency_exchange.service;

import com.cicarus.currency_exchange.client.AccountServiceClient;
import com.cicarus.currency_exchange.domain.ExchangeRate;
import com.cicarus.currency_exchange.dto.ConvertBrlToUsdRequest;
import com.cicarus.currency_exchange.dto.ConvertBrlToUsdResponse;
import com.cicarus.currency_exchange.dto.ConvertRequest;
import com.cicarus.currency_exchange.dto.ConvertResponse;
import com.cicarus.currency_exchange.dto.UpdateAccountBalancesRequest;
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
        updateRequest.setUserId(request.getUserId());
        updateRequest.setBrlAmount(request.getAmount());
        updateRequest.setUsdAmount(convertedUsdAmount);

        accountServiceClient.updateAccountBalances(updateRequest);

        return new ConvertBrlToUsdResponse(request.getAmount(), convertedUsdAmount, brlToUsdRate);
    }
}

