package com.cicarus.investment.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.cicarus.investment.dtos.stock.StockDto;
import com.cicarus.investment.model.stock.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock,Long> {
    List<Stock> findAllByAccountId(Long accountId);

    Optional<Stock> findFirstBySymbolAndAccountId(String symbol, Long accountId);

}
