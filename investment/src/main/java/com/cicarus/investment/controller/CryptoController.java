package com.cicarus.investment.controller;

import com.cicarus.investment.dtos.crypto.CryptoDto;
import com.cicarus.investment.dtos.crypto.CryptoRequestDto;
import com.cicarus.investment.dtos.investment.InvestmentDto;
import com.cicarus.investment.model.investment.InvestmentType;
import com.cicarus.investment.service.CryptoService;
import com.cicarus.investment.service.account.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("crypto")
@Tag(name = "Crypto Microservice")
public class CryptoController {
    private CryptoService cryptoService;
    private AccountService accountService;

    public CryptoController(CryptoService cryptoService, AccountService accountService) {
        this.cryptoService = cryptoService;
        this.accountService = accountService;
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
        // Check if the user has enough USD in their account to make the purchase, and if he does, withdraw the amount
        accountService.withdrawUSD(cryptoRequestDto.accountId(), cryptoRequestDto.amountInvested());
        return cryptoService.create(cryptoRequestDto);
    }

    @Operation(summary = "Get that returns a sum of of a user's investment in cryptocurrency")
    @GetMapping("/sum/{accountId}")
    public BigDecimal getUsersInvestmentCrypto(@PathVariable Long accountId) {
        BigDecimal sum = BigDecimal.ZERO;
        List<CryptoDto> cryptoDtoList = cryptoService.findAllByAccountId(accountId);

        for( CryptoDto crypto : cryptoDtoList) {
            sum = sum.add(crypto.amountInvested());
        }
        return sum;
    }
}
