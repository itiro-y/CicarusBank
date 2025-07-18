package com.cicarus.investment.controller;

import com.cicarus.investment.dtos.crypto.CryptoDto;
import com.cicarus.investment.dtos.crypto.CryptoRequestDto;
import com.cicarus.investment.dtos.investment.InvestmentRequestDto;
import com.cicarus.investment.dtos.stock.StockDto;
import com.cicarus.investment.dtos.stock.StockRequestDto;
import com.cicarus.investment.model.investment.InvestmentStatus;
import com.cicarus.investment.model.investment.InvestmentType;
import com.cicarus.investment.model.transaction.TransactionType;
import com.cicarus.investment.service.InvestmentService;
import com.cicarus.investment.service.StockService;
import com.cicarus.investment.service.account.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("stock")
@Tag(name = "Stock Microservice")
public class StockController {
    private StockService stockService;
    private AccountService accountService;
    private InvestmentService investmentService;

    public StockController(StockService stockService, AccountService accountService, InvestmentService investmentService) {
        this.stockService = stockService;
        this.accountService = accountService;
        this.investmentService = investmentService;
    }

    @Operation(summary = "Get that returns a list of all stocks")
    @GetMapping
    public List<StockDto> getAllStocks() {
        return stockService.findAll();
    }

    @Operation(summary = "Get that returns a list of all stocks of a specific accountId")
    @GetMapping("list/{accountId}")
    public List<StockDto> getUserStocks(@PathVariable Long accountId) {
        return stockService.findAllByAccountId(accountId);
    }

    @Operation(summary = "Get that returns a stock based on its ID")
    @GetMapping("/{id}")
    public StockDto getInvestment(@PathVariable Long id) {
        return stockService.findById(id);
    }

    @Operation(summary = "Post that creates a new Stock based on a StockRequestDto JSON")
    @PostMapping()
    public List<StockDto> createInvestment(@RequestBody StockRequestDto stockRequestDto) {
        System.out.println(stockRequestDto.accountId());

        InvestmentRequestDto investmentRequestDto = new InvestmentRequestDto(
                null,
                stockRequestDto.accountId(),
                InvestmentType.ACOES,
                InvestmentStatus.ATIVO,
                stockRequestDto.currentPrice().multiply(stockRequestDto.volume()),
                stockRequestDto.currentPrice().multiply(stockRequestDto.volume()),
                BigDecimal.ZERO,
                null,
                true
        );
        accountService.withdrawUSD(stockRequestDto.accountId(), stockRequestDto.currentPrice().multiply(stockRequestDto.volume()));

        investmentService.create(investmentRequestDto);

        return stockService.create(stockRequestDto, stockRequestDto.volume());
    }

    @Operation(summary = "Get that returns a sum of of a user's investment in stocks")
    @GetMapping("/sum/{accountId}")
    public BigDecimal getUsersInvestmentStocks(@PathVariable Long accountId) {
        BigDecimal sum = BigDecimal.ZERO;
        List<StockDto> stockDtoList = stockService.findAllByAccountId(accountId);

        for( StockDto stock : stockDtoList) {
            sum = sum.add((stock.currentPrice().multiply(stock.volume())));
        }
        return sum;
    }

    @Operation(summary = "Delete that remosves a stock based on its symbol and accountId")
    @DeleteMapping("sell/{symbol}/{accountId}")
    public void deleteStock(@PathVariable String symbol, @PathVariable Long accountId) {
        StockDto stockDto = stockService.findBySymbolAndAccountId(symbol, accountId);

        if (stockDto != null) {
            BigDecimal totalValue = stockDto.currentPrice();
            accountService.depositUSD(accountId, totalValue);
            stockService.delete(stockDto.id());
        }
    }
}
