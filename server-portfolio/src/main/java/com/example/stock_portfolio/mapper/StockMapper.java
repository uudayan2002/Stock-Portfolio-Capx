package com.example.stock_portfolio.mapper; // Package declaration for StockMapper class

import com.example.stock_portfolio.dto.StockDto; // Importing StockDto class to represent the stock data transfer object
import com.example.stock_portfolio.entity.Stocks; // Importing Stocks class to represent the entity

public class StockMapper {

    // Mapping from Stocks entity to StockDto
    public static StockDto mapToStockDto(Stocks stock) {
        // Returning a new StockDto object by extracting values from the Stocks entity
        return new StockDto(
                stock.getId(), // Mapping id field from Stocks entity to StockDto
                stock.getStockName(), // Mapping stockName field from Stocks entity to StockDto
                stock.getTicker(), // Mapping ticker field from Stocks entity to StockDto
                stock.getQuantity(), // Mapping quantity field from Stocks entity to StockDto
                stock.getBuyPrice(), // Mapping buyPrice field from Stocks entity to StockDto
                stock.getCurrentPrice() // Mapping currentPrice field from Stocks entity to StockDto
        );
    }

    // Mapping from StockDto to Stocks entity
    public static Stocks mapToStock(StockDto stockDto) {
        // Returning a new Stocks entity object by extracting values from StockDto
        return new Stocks(
                stockDto.getId(), // Mapping id field from StockDto to Stocks entity
                stockDto.getStockName(), // Mapping stockName field from StockDto to Stocks entity
                stockDto.getTicker(), // Mapping ticker field from StockDto to Stocks entity
                stockDto.getQuantity(), // Mapping quantity field from StockDto to Stocks entity
                stockDto.getBuyPrice(), // Mapping buyPrice field from StockDto to Stocks entity
                stockDto.getCurrentPrice() // Mapping currentPrice field from StockDto to Stocks entity
        );
    }
}
