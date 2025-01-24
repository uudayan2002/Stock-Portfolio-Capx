package com.example.stock_portfolio.service;
import java.util.List;
import java.util.Map;

import com.example.stock_portfolio.dto.StockDto;

public interface StockService {
    StockDto createStock(StockDto stockDto);

    StockDto getStockById(Long stockId);

    List<StockDto> getAllStocks();

    StockDto updateStock(Long stockId, StockDto updatedStock);

    void deleteStock(Long stockId);

    Map<String, Object> getStockHistoricalData(String ticker);
    Map<String, Object> getTickerInfo(String ticker);
}
