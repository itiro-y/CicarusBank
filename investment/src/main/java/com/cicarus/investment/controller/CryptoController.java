package com.cicarus.investment.controller;

import com.cicarus.investment.dtos.crypto.CryptoDto;
import com.cicarus.investment.dtos.crypto.CryptoRequestDto;
import com.cicarus.investment.dtos.investment.InvestmentDto;
import com.cicarus.investment.dtos.investment.InvestmentRequestDto;
import com.cicarus.investment.dtos.stock.StockDto;
import com.cicarus.investment.model.crypto.CryptoType;
import com.cicarus.investment.model.investment.InvestmentStatus;
import com.cicarus.investment.model.investment.InvestmentType;
import com.cicarus.investment.service.CryptoService;
import com.cicarus.investment.service.InvestmentService;
import com.cicarus.investment.service.account.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("crypto")
@Tag(name = "Crypto Microservice")
public class CryptoController {
    private CryptoService cryptoService;
    private AccountService accountService;
    private InvestmentService investmentService;

    public CryptoController(CryptoService cryptoService, AccountService accountService, InvestmentService investmentService) {
        this.cryptoService = cryptoService;
        this.accountService = accountService;
        this.investmentService = investmentService;
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
        accountService.withdrawUSD(cryptoRequestDto.accountId(), cryptoRequestDto.amountInvested());
        InvestmentRequestDto investmentRequestDto = new InvestmentRequestDto(
                null,
                cryptoRequestDto.accountId(),
                InvestmentType.CRIPTOMOEDA,
                InvestmentStatus.ATIVO,
                cryptoRequestDto.amountInvested(),
                cryptoRequestDto.currentValue(),
                 BigDecimal.ZERO,
                null,
                false
        );
        investmentService.create(investmentRequestDto);
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

    @Operation(summary = "Delete that removes a crypto based on its type and accountId")
    @DeleteMapping("sell/{type}/{accountId}")
    public void deleteStock(@PathVariable CryptoType type, @PathVariable Long accountId) {
        CryptoDto cryptoDto = cryptoService.findByTypeAndAccountId(type, accountId);

        if (cryptoDto != null) {
            BigDecimal totalValue = cryptoDto.currentValue();
            accountService.depositUSD(accountId, totalValue);
            cryptoService.delete(cryptoDto.id());
        }
    }
}
