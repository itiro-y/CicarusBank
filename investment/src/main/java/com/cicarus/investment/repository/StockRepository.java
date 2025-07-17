package com.cicarus.investment.repository;

import com.cicarus.investment.dtos.stock.StockDto;
import com.cicarus.investment.model.stock.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockRepository extends JpaRepository<Stock,Long> {
    List<Stock> findAllByAccountId(Long accountId);
}
