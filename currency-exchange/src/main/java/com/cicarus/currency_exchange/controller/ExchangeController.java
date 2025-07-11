package com.cicarus.currency_exchange.controller;

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

    // localhost:8500/exchange/rate?from={MOEDA_ORIGEM}&to={MOEDA_DESTINO}
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

    @GetMapping("/ping")
    public String ping(){
        return "Pong!";
    }
}
