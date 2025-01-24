package com.example.stock_portfolio.mapper;

import com.example.stock_portfolio.dto.StockDto;
import com.example.stock_portfolio.entity.Stocks;

public class StockMapper {

    // Mapping from Stocks entity to StockDto
    public static StockDto mapToStockDto(Stocks stock){
        return new StockDto(
                stock.getId(),
                stock.getStockName(),
                stock.getTicker(),
                stock.getQuantity(),
                stock.getBuyPrice(),
                stock.getCurrentPrice()
        );
    }

    // Mapping from StockDto to Stocks entity
    public static Stocks mapToStock(StockDto stockDto){
        return new Stocks(
                stockDto.getId(),
                stockDto.getStockName(),
                stockDto.getTicker(),
                stockDto.getQuantity(),
                stockDto.getBuyPrice(),
                stockDto.getCurrentPrice()
        );
    }
}
