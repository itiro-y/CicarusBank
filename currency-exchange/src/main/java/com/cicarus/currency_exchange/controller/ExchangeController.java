package com.cicarus.currency_exchange.controller;

import com.cicarus.currency_exchange.dto.ConvertRequest;
import com.cicarus.currency_exchange.dto.ConvertResponse;
import com.cicarus.currency_exchange.service.ExchangeService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping
public class ExchangeController {

    private final ExchangeService service;

    public ExchangeController(ExchangeService service) {
        this.service = service;
    }

    @GetMapping("/rate")
    public BigDecimal getRate(@RequestParam String from, @RequestParam String to) {
        return service.getRate(from, to);
    }
    @PostMapping("/convert")
    public ConvertResponse convert(@RequestBody ConvertRequest request) {
        return service.convert((request));
    }
}
