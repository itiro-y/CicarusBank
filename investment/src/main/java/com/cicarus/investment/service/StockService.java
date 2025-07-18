package com.cicarus.investment.service;

import com.cicarus.investment.dtos.stock.StockDto;
import com.cicarus.investment.dtos.stock.StockRequestDto;
import com.cicarus.investment.model.stock.Stock;
import com.cicarus.investment.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockService {
    private StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public List<StockDto> findAll(){
        return stockRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public StockDto findById(Long id){
        return stockRepository.findById(id).map(this::toDto).orElse(null);
    }

    public StockDto create(StockRequestDto requestDto){
        Stock investment = toEntity(requestDto);
        Stock saved = stockRepository.save(investment);
        return toDto(saved);
    }

    public List<StockDto> findAllByAccountId(Long accountId){
        return stockRepository.findAllByAccountId(accountId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public Stock toEntity(StockRequestDto request) {
        Stock stock = new Stock();
        stock.setSymbol(request.symbol());
        stock.setAccountId(request.accountId());
        stock.setCompanyName(request.companyName());
        stock.setCurrency(request.currency());
        stock.setSetor(request.setor());
        stock.setCurrentPrice(request.currentPrice());
        stock.setTradeTime(new Date());
        stock.setVolume(request.volume());
        stock.setMarketCap(request.marketCap());
        stock.setPeRatio(request.peRatio());
        stock.setDividendYield(request.dividendYield());
        return stock;
    }

    public StockDto toDto(Stock stock) {
        return new StockDto(
                stock.getId(),
                stock.getAccountId(),
                stock.getSymbol(),
                stock.getCompanyName(),
                stock.getCurrency(),
                stock.getSetor(),
                stock.getCurrentPrice(),
                stock.getTradeTime(),
                stock.getVolume(),
                stock.getMarketCap(),
                stock.getPeRatio(),
                stock.getDividendYield()
        );
    }
}
