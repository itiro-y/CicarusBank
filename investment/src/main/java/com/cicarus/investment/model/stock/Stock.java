package com.cicarus.investment.model.stock;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_id")
    private Long accountId;

    @Column
    private String symbol;

    @Column(name = "company_name")
    private String companyName;

    @Column
    @Enumerated(EnumType.STRING)
    private StockCurrencyType currency;

    @Column
    private String setor;

    @Column(name = "current_price")
    private BigDecimal currentPrice;

    @Column(name = "trade_time")
    @Temporal(TemporalType.DATE)
    private Date tradeTime;

    @Column
    private BigDecimal volume; //volume negociado

    @Column(name = "market_cap")
    private BigDecimal marketCap; //valor de mercado

    @Column(name = "pe_ratio")
    private BigDecimal peRatio; //preço sobre lucro

    @Column(name = "dividend_yield")
    private BigDecimal dividendYield; //rendimento de dividendos

    public Stock() {}

    public Stock(Long id, Long accountId, String symbol, String companyName, StockCurrencyType currency, String setor, BigDecimal currentPrice, Date tradeTime, BigDecimal volume, BigDecimal marketCap, BigDecimal peRatio, BigDecimal dividendYield) {
        this.id = id;
        this.accountId = accountId;
        this.symbol = symbol;
        this.companyName = companyName;
        this.currency = currency;
        this.setor = setor;
        this.currentPrice = currentPrice;
        this.tradeTime = tradeTime;
        this.volume = volume;
        this.marketCap = marketCap;
        this.peRatio = peRatio;
        this.dividendYield = dividendYield;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public StockCurrencyType getCurrency() {
        return currency;
    }

    public void setCurrency(StockCurrencyType currency) {
        this.currency = currency;
    }

    public String getSetor() {
        return setor;
    }

    public void setSetor(String setor) {
        this.setor = setor;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public Date getTradeTime() {
        return tradeTime;
    }

    public void setTradeTime(Date tradeTime) {
        this.tradeTime = tradeTime;
    }

    public BigDecimal getVolume() {
        return volume;
    }

    public void setVolume(BigDecimal volume) {
        this.volume = volume;
    }

    public BigDecimal getMarketCap() {
        return marketCap;
    }

    public void setMarketCap(BigDecimal marketCap) {
        this.marketCap = marketCap;
    }

    public BigDecimal getPeRatio() {
        return peRatio;
    }

    public void setPeRatio(BigDecimal peRatio) {
        this.peRatio = peRatio;
    }

    public BigDecimal getDividendYield() {
        return dividendYield;
    }

    public void setDividendYield(BigDecimal dividendYield) {
        this.dividendYield = dividendYield;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Stock stock = (Stock) o;
        return Objects.equals(id, stock.id) && Objects.equals(symbol, stock.symbol) && Objects.equals(companyName, stock.companyName) && currency == stock.currency && Objects.equals(setor, stock.setor) && Objects.equals(currentPrice, stock.currentPrice) && Objects.equals(tradeTime, stock.tradeTime) && Objects.equals(volume, stock.volume) && Objects.equals(marketCap, stock.marketCap) && Objects.equals(peRatio, stock.peRatio) && Objects.equals(dividendYield, stock.dividendYield);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, symbol, companyName, currency, setor, currentPrice, tradeTime, volume, marketCap, peRatio, dividendYield);
    }

    @Override
    public String toString() {
        return "Stock{" +
                "id=" + id +
                ", symbol='" + symbol + '\'' +
                ", companyName='" + companyName + '\'' +
                ", currency=" + currency +
                ", setor='" + setor + '\'' +
                ", currentPrice=" + currentPrice +
                ", tradeTime=" + tradeTime +
                ", volume=" + volume +
                ", marketCap=" + marketCap +
                ", peRatio=" + peRatio +
                ", dividendYield=" + dividendYield +
                '}';
    }
}
