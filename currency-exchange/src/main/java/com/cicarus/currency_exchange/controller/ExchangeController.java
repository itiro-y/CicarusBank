package com.cicarus.currency_exchange.controller;

import com.cicarus.currency_exchange.dto.ConvertBrlToEurRequest;
import com.cicarus.currency_exchange.dto.ConvertBrlToEurResponse;
import com.cicarus.currency_exchange.dto.ConvertBrlToUsdRequest;
import com.cicarus.currency_exchange.dto.ConvertBrlToUsdResponse;
import com.cicarus.currency_exchange.dto.ConvertRequest;
import com.cicarus.currency_exchange.dto.ConvertResponse;
import com.cicarus.currency_exchange.service.ExchangeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@Tag(name = "Currency Exchange Endpoint")
@RestController
@RequestMapping("/exchange")
public class ExchangeController {

    private final ExchangeService service;

    public ExchangeController(ExchangeService service) {
        this.service = service;
    }

    
    @Operation(summary = "Obtem a taxa de câmbio entre duas moedas")
    @GetMapping("/rate")
    public BigDecimal getRate(@RequestParam String from, @RequestParam String to) {
        return service.getRate(from, to);
    }

    /*localhost:8500/exchange/convert
    body:
    {
    "from": "{MOEDA}",
    "to": "{MOEDA}",
    "amount": 200
    }
    */
    @Operation(summary = "Converte o valor de uma moeda para a outra")
    @PostMapping("/convert")
    public ConvertResponse convert(@RequestBody ConvertRequest request) {
        return service.convert((request));
    }

    @Operation(summary = "Converte BRL para USD e atualiza as carteiras do usuário")
    @PostMapping("/convert-brl-to-usd")
    public ConvertBrlToUsdResponse convertBrlToUsd(@RequestBody ConvertBrlToUsdRequest request) {
        return service.convertBrlToUsd(request);
    }

    @Operation(summary = "Converte BRL para EUR e atualiza as carteiras do usuário")
    @PostMapping("/convert-brl-to-eur")
    public ConvertBrlToEurResponse convertBrlToEur(@RequestBody ConvertBrlToEurRequest request) {
        return service.convertBrlToEur(request);
    }

    @GetMapping("/ping")
    public String ping(){
        return "Pong!";
    }
}
