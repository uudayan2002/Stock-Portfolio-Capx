package com.example.stock_portfolio.service; // Package declaration for StockService interface

import java.util.List; // Importing List to represent a list of StockDto objects
import java.util.Map; // Importing Map to represent key-value pairs for stock data

import com.example.stock_portfolio.dto.StockDto; // Importing StockDto class

public interface StockService {

    // Method to create a new stock entry
    StockDto createStock(StockDto stockDto);

    // Method to retrieve a stock by its ID
    StockDto getStockById(Long stockId);

    // Method to retrieve all stocks in the system
    List<StockDto> getAllStocks();

    // Method to update a stock's information
    StockDto updateStock(Long stockId, StockDto updatedStock);

    // Method to delete a stock by its ID
    void deleteStock(Long stockId);

    // Method to retrieve historical data for a stock using its ticker symbol
    Map<String, Object> getStockHistoricalData(String ticker);

    // Method to retrieve information about a stock (such as company name, current price) using its ticker symbol
    Map<String, Object> getTickerInfo(String ticker);
}
