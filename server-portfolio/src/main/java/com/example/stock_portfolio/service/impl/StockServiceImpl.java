package com.example.stock_portfolio.service.impl;

import com.example.stock_portfolio.dto.StockDto; // Importing StockDto class
import com.example.stock_portfolio.entity.Stocks; // Importing Stocks entity class
import com.example.stock_portfolio.exception.ResourceNotFoundException; // Importing custom exception for resource not found
import com.example.stock_portfolio.exception.TwelveDataApiException; // Importing custom exception for Twelve Data API errors
import com.example.stock_portfolio.mapper.StockMapper; // Importing the StockMapper for entity-DTO conversion
import com.example.stock_portfolio.repository.StockRepository; // Importing the StockRepository for DB operations
import com.example.stock_portfolio.service.StockService; // Importing StockService interface

import lombok.AllArgsConstructor; // Lombok annotation for constructor injection

import org.springframework.stereotype.Service; // Marking this class as a service
import org.springframework.web.client.RestTemplate; // Importing RestTemplate for making API calls
import org.springframework.beans.factory.annotation.Value; // Importing annotation to inject values from properties
import org.springframework.http.ResponseEntity; // Importing ResponseEntity for HTTP responses

import com.fasterxml.jackson.databind.JsonNode; // Importing JsonNode for parsing JSON data
import com.fasterxml.jackson.databind.ObjectMapper; // Importing ObjectMapper for converting JSON to objects

import java.util.ArrayList; // Importing ArrayList to hold lists of data
import java.util.HashMap; // Importing HashMap for key-value pairs
import java.util.List; // Importing List for collection of items
import java.util.Map; // Importing Map for key-value pairs
import java.util.stream.Collectors; // Importing Collectors for stream operations

import org.springframework.scheduling.annotation.Scheduled; // Importing annotation for scheduling tasks

@Service // Marking this class as a Spring service
@AllArgsConstructor // Lombok annotation to generate a constructor with all arguments
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository; // Injecting stock repository for DB operations
    private final RestTemplate restTemplate; // Injecting RestTemplate for API calls

    // Inject API Key for Twelve Data
    @Value("${TWELVE_DATA_API_KEY}")
    private final String apiKey; // API key for accessing Twelve Data API

    // Method to create a new stock
    @Override
    public StockDto createStock(StockDto stockDto) {
        String ticker = stockDto.getTicker().trim().toUpperCase(); // Clean up and capitalize ticker symbol
        String stockName = getStockNameByTicker(ticker); // Get stock name using ticker
        if (stockName == null || stockName.isEmpty()) {
            throw new IllegalArgumentException("The stock ticker " + ticker + " is not valid or could not be found.");
        }
        double buyPrice = getStockBuyPriceByTicker(ticker); // Get stock buy price using ticker

        stockDto.setStockName(stockName); // Set the stock name
        stockDto.setBuyPrice(buyPrice); // Set the buy price
        stockDto.setCurrentPrice(buyPrice); // Set the current price to the buy price initially
        stockDto.setQuantity(1L); // Set default quantity

        Stocks stock = StockMapper.mapToStock(stockDto); // Convert DTO to entity
        Stocks savedStock = stockRepository.save(stock); // Save the stock to the DB
        return StockMapper.mapToStockDto(savedStock); // Return saved stock as DTO
    }

    // Fetch stock name from Twelve Data API using the ticker symbol
    private String getStockNameByTicker(String ticker) {
        String apiUrl = "https://api.twelvedata.com/quote?symbol=" + ticker +
                "&apikey=" + apiKey; // Construct API URL
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class); // API call
            String responseBody = response.getBody(); // Get response body

            // Check if the response status code is 500 or if there are any issues with the data
            if (response.getStatusCode().value() == 400) {
                // Custom error handling when server responds with a 500 error (invalid ticker or internal error)
                throw new IllegalArgumentException("Invalid ticker name, please insert a valid one.");
            }
            ObjectMapper objectMapper = new ObjectMapper(); // Initialize ObjectMapper
            JsonNode jsonNode = objectMapper.readTree(responseBody); // Parse JSON response
            // Check if the API response contains an error (invalid ticker)
            if (jsonNode.has("code") && jsonNode.get("code").asInt() != 200) {
                throw new IllegalArgumentException("Invalid ticker name, please insert a valid one.");
            }
            return jsonNode.path("name").asText(); // Extract stock name from JSON
        } catch (Exception e) {
            throw new RuntimeException("Error fetching stock name", e); // Handle errors
        }
    }

    // Fetch stock buy price from Twelve Data API using the ticker symbol
    private double getStockBuyPriceByTicker(String ticker) {
        String apiUrl = "https://api.twelvedata.com/quote?symbol=" + ticker +
                "&apikey=" + apiKey; // Construct API URL
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class); // API call
            String responseBody = response.getBody(); // Get response body

            ObjectMapper objectMapper = new ObjectMapper(); // Initialize ObjectMapper
            JsonNode jsonNode = objectMapper.readTree(responseBody); // Parse JSON response
            return jsonNode.path("close").asDouble(); // Extract close price from JSON
        } catch (Exception e) {
            throw new RuntimeException("Error fetching stock buy price", e); // Handle errors
        }
    }

    // Method to fetch stock by ID
    @Override
    public StockDto getStockById(Long stockId) {
        Stocks stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock does not exist for the given id: " + stockId)); // Handle resource not found
        return StockMapper.mapToStockDto(stock); // Return stock as DTO
    }

    // Method to fetch all stocks
    @Override
    public List<StockDto> getAllStocks() {
        List<Stocks> stocks = stockRepository.findAll(); // Fetch all stocks from DB
        return stocks.stream().map(StockMapper::mapToStockDto).collect(Collectors.toList()); // Convert entities to DTOs
    }

    // Method to update stock details
    @Override
    public StockDto updateStock(Long stockId, StockDto updatedStock) {
        Stocks existingStock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock does not exist with the given id: " + stockId)); // Handle resource not found

        String ticker = updatedStock.getTicker(); // Get ticker
        String stockName = getStockNameByTicker(ticker); // Fetch stock name
        double buyPrice = getStockBuyPriceByTicker(ticker); // Fetch buy price

        // Update stock details
        existingStock.setTicker(ticker);
        existingStock.setStockName(stockName);
        existingStock.setBuyPrice(buyPrice);
        existingStock.setCurrentPrice(buyPrice);
        existingStock.setQuantity(1L); // Ensuring quantity remains 1

        Stocks updatedStockObj = stockRepository.save(existingStock); // Save updated stock to DB

        return StockMapper.mapToStockDto(updatedStockObj); // Return updated stock as DTO
    }

    // Method to delete stock
    @Override
    public void deleteStock(Long stockId) {
        Stocks stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock does not exist with the given id: " + stockId)); // Handle resource not found
        stockRepository.delete(stock); // Delete stock from DB
    }

    // Scheduled task to update stock prices every 10 minutes
    @Scheduled(fixedRate = 600000) // Run every 10 minutes
    public void updateStockPrices() {
        List<Stocks> stocksList = stockRepository.findAll(); // Fetch all stocks from DB
    
        for (Stocks stock : stocksList) {
            String ticker = stock.getTicker(); // Get ticker
            String apiUrl = "https://api.twelvedata.com/quote?symbol=" + ticker + "&apikey=" + apiKey; // API URL
    
            try {
                ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class); // API call
                String responseBody = response.getBody(); // Get response body
    
                ObjectMapper objectMapper = new ObjectMapper(); // Initialize ObjectMapper
                JsonNode jsonNode = objectMapper.readTree(responseBody); // Parse JSON response
                double currentPrice = jsonNode.path("close").asDouble(); // Extract current price from JSON
    
                // Update the stock entity with the new price
                stock.setCurrentPrice(currentPrice);
                stockRepository.save(stock); // Save updated stock entity to the database
    
                System.out.println("Updated stock: " + ticker + " with price: " + currentPrice); // Log updated stock info
            } catch (Exception e) {
                System.err.println("Error updating stock price for ticker: " + ticker); // Handle error
                e.printStackTrace();
            }
        }
    }

    // Method to fetch historical data for a stock
    @Override
    public Map<String, Object> getStockHistoricalData(String ticker) {
        String apiUrl = "https://api.twelvedata.com/time_series?symbol=" + ticker 
                      + "&interval=1h&outputsize=100&apikey=" + apiKey; // API URL for historical data
    
        JsonNode response = fetchTwelveData(apiUrl); // Fetch data
        return processHistoricalData(response); // Process and return historical data
    }

    // Method to fetch ticker info for a stock
    @Override
    public Map<String, Object> getTickerInfo(String ticker) {
        String apiUrl = "https://api.twelvedata.com/quote?symbol=" + ticker 
                      + "&apikey=" + apiKey; // API URL for ticker info
    
        JsonNode response = fetchTwelveData(apiUrl); // Fetch data
        return processTickerInfo(response); // Process and return ticker info
    }

    // Process historical data
    private Map<String, Object> processHistoricalData(JsonNode jsonNode) {
        Map<String, Object> result = new HashMap<>();
        JsonNode values = jsonNode.path("values"); // Get "values" array from response
    
        // Extract datetime and close price for each entry
        List<Map<String, Object>> formattedValues = new ArrayList<>();
        for (JsonNode value : values) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("datetime", value.path("datetime").asText()); // Extract datetime
            entry.put("close", value.path("close").asDouble()); // Extract close price
            formattedValues.add(entry); // Add to the list
        }
    
        result.put("values", formattedValues); // Add formatted data to result
        return result;
    }

    // Process ticker info
    private Map<String, Object> processTickerInfo(JsonNode jsonNode) {
        Map<String, Object> info = new HashMap<>();
        info.put("name", jsonNode.path("name").asText()); // Extract name
        info.put("symbol", jsonNode.path("symbol").asText()); // Extract symbol
        info.put("price", jsonNode.path("close").asDouble()); // Extract price
        info.put("currency", jsonNode.path("currency").asText()); // Extract currency
        info.put("exchange", jsonNode.path("exchange").asText()); // Extract exchange
        info.put("country", jsonNode.path("country").asText()); // Extract country
        return info; // Return processed info
    }

    // Reusable method to fetch data from Twelve Data API
    private JsonNode fetchTwelveData(String apiUrl) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class); // API call
            ObjectMapper objectMapper = new ObjectMapper(); // Initialize ObjectMapper
            JsonNode rootNode = objectMapper.readTree(response.getBody()); // Parse response body

            // Check for API errors
            if (rootNode.has("code") && rootNode.get("code").asInt() != 200) {
                int statusCode = rootNode.get("code").asInt();
                String errorMessage = "API Error: " + rootNode.path("message").asText(); // Extract error message
                throw new TwelveDataApiException(statusCode, errorMessage); // Throw custom exception
            }

            return rootNode; // Return parsed data
        } catch (Exception e) {
            // Handle generic errors (e.g., network issues)
            throw new TwelveDataApiException(500, "Failed to fetch data: " + e.getMessage()); // Handle errors
        }
    }
}
