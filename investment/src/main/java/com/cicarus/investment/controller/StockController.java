package com.cicarus.investment.controller;

import com.cicarus.investment.dtos.crypto.CryptoDto;
import com.cicarus.investment.dtos.crypto.CryptoRequestDto;
import com.cicarus.investment.dtos.stock.StockDto;
import com.cicarus.investment.dtos.stock.StockRequestDto;
import com.cicarus.investment.service.StockService;
import com.cicarus.investment.service.account.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("stock")
@Tag(name = "Stock Microservice")
public class StockController {
    private StockService stockService;
    private AccountService accountService;

    public StockController(StockService stockService, AccountService accountService) {
        this.stockService = stockService;
        this.accountService = accountService;
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
    public StockDto createInvestment(@RequestBody StockRequestDto stockRequestDto) {
        // Check if the user has enough USD in their account to make the purchase, and if he does, withdraw the amount
        accountService.withdrawUSD(stockRequestDto.accountId(), stockRequestDto.currentPrice().multiply(stockRequestDto.volume()));
        return stockService.create(stockRequestDto);
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
}
