package com.cicarus.investment.controller;

import com.cicarus.investment.dtos.CryptoDto;
import com.cicarus.investment.dtos.CryptoRequestDto;
import com.cicarus.investment.dtos.InvestmentDto;
import com.cicarus.investment.dtos.InvestmentRequestDto;
import com.cicarus.investment.service.CryptoService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("crypto")
public class CryptoController {
    private CryptoService cryptoService;

    public CryptoController(CryptoService cryptoService) {
        this.cryptoService = cryptoService;
    }



    @Operation(summary = "Get that returns a list of all investments")
    @GetMapping
    public List<CryptoDto> getAllInvestments() {
        return cryptoService.findAll();
    }

    @Operation(summary = "Get that returns a list of all investments of a specific accountId")
    @GetMapping("list/{accountId}")
    public List<CryptoDto> getUserInvestments(@PathVariable Long accountId) {
        return cryptoService.findAllByAccountId(accountId);
    }

    @Operation(summary = "Get that returns a investment based on its ID")
    @GetMapping("/{id}")
    public CryptoDto getInvestment(@PathVariable Long id) {
        return cryptoService.findById(id);
    }

    @Operation(summary = "Post that creates a new Investment based on a InvestmentRequestDto JSON")
    @PostMapping()
    public CryptoDto createInvestment(@RequestBody CryptoRequestDto cryptoRequestDto) {
        return cryptoService.create(cryptoRequestDto);
    }
}
