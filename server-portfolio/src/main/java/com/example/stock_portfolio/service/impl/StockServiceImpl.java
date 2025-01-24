package com.example.stock_portfolio.service.impl;

import com.example.stock_portfolio.dto.StockDto;
import com.example.stock_portfolio.entity.Stocks;
import com.example.stock_portfolio.exception.ResourceNotFoundException;
import com.example.stock_portfolio.exception.TwelveDataApiException;
import com.example.stock_portfolio.mapper.StockMapper;
import com.example.stock_portfolio.repository.StockRepository;
import com.example.stock_portfolio.service.StockService;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;

@Service
@AllArgsConstructor
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;
    private final RestTemplate restTemplate;

    // Inject API Key for Twelve Data
    private final String apiKey = "d57f2107d0484502a18fe5fe666a278b";

    @Override
    public StockDto createStock(StockDto stockDto) {
        String ticker = stockDto.getTicker().trim().toUpperCase();
        String stockName = getStockNameByTicker(ticker);
        double buyPrice = getStockBuyPriceByTicker(ticker);

        stockDto.setStockName(stockName);
        stockDto.setBuyPrice(buyPrice);
        stockDto.setCurrentPrice(buyPrice);
        stockDto.setQuantity(1L);

        Stocks stock = StockMapper.mapToStock(stockDto);
        Stocks savedStock = stockRepository.save(stock);
        return StockMapper.mapToStockDto(savedStock);
    }

    // Fetch stock name from Twelve Data API
    private String getStockNameByTicker(String ticker) {
        String apiUrl = "https://api.twelvedata.com/quote?symbol=" + ticker +
                "&apikey=" + apiKey;
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            return jsonNode.path("name").asText();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching stock name", e);
        }
    }

    // Fetch stock buy price from Twelve Data API
    private double getStockBuyPriceByTicker(String ticker) {
        String apiUrl = "https://api.twelvedata.com/quote?symbol=" + ticker +
                "&apikey=" + apiKey;
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            return jsonNode.path("close").asDouble();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching stock buy price", e);
        }
    }

    @Override
    public StockDto getStockById(Long stockId) {
        Stocks stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock does not exist for the given id: " + stockId));
        return StockMapper.mapToStockDto(stock);
    }

    @Override
    public List<StockDto> getAllStocks() {
        List<Stocks> stocks = stockRepository.findAll();
        return stocks.stream().map(StockMapper::mapToStockDto).collect(Collectors.toList());
    }

    @Override
    public StockDto updateStock(Long stockId, StockDto updatedStock) {
        Stocks existingStock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock does not exist with the given id: " + stockId));

        String ticker = updatedStock.getTicker();
        String stockName = getStockNameByTicker(ticker);
        double buyPrice = getStockBuyPriceByTicker(ticker);

        existingStock.setTicker(ticker);
        existingStock.setStockName(stockName);
        existingStock.setBuyPrice(buyPrice);
        existingStock.setCurrentPrice(buyPrice);
        existingStock.setQuantity(1L); // Ensuring quantity remains 1

        Stocks updatedStockObj = stockRepository.save(existingStock);

        return StockMapper.mapToStockDto(updatedStockObj);
    }

    @Override
    public void deleteStock(Long stockId) {
        Stocks stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock does not exist with the given id: " + stockId));
        stockRepository.delete(stock);
    }

    // Scheduled task to update stock prices every 60 seconds
    @Scheduled(fixedRate = 600000) // every 60 seconds
    public void updateStockPrices() {
        List<Stocks> stocksList = stockRepository.findAll();
    
        for (Stocks stock : stocksList) {
            String ticker = stock.getTicker();
            String apiUrl = "https://api.twelvedata.com/quote?symbol=" + ticker + "&apikey=" + apiKey;
    
            try {
                ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);
                String responseBody = response.getBody();
    
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(responseBody);
                double currentPrice = jsonNode.path("close").asDouble();
    
                // Update the stock entity with the new price
                stock.setCurrentPrice(currentPrice);
                stockRepository.save(stock); // Save updated stock entity to the database
    
                System.out.println("Updated stock: " + ticker + " with price: " + currentPrice);
            } catch (Exception e) {
                System.err.println("Error updating stock price for ticker: " + ticker);
                e.printStackTrace();
            }
        }
    }

    @Override
    public Map<String, Object> getStockHistoricalData(String ticker) {
        String apiUrl = "https://api.twelvedata.com/time_series?symbol=" + ticker 
                      + "&interval=1h&outputsize=100&apikey=" + apiKey;
    
        JsonNode response = fetchTwelveData(apiUrl);
        return processHistoricalData(response);
    }

    @Override
    public Map<String, Object> getTickerInfo(String ticker) {
        String apiUrl = "https://api.twelvedata.com/quote?symbol=" + ticker 
                      + "&apikey=" + apiKey;
    
        JsonNode response = fetchTwelveData(apiUrl);
        return processTickerInfo(response);
    }

    private Map<String, Object> processHistoricalData(JsonNode jsonNode) {
        Map<String, Object> result = new HashMap<>();
        JsonNode values = jsonNode.path("values");
    
        // Extract datetime and close price for each entry
        List<Map<String, Object>> formattedValues = new ArrayList<>();
        for (JsonNode value : values) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("datetime", value.path("datetime").asText());
            entry.put("close", value.path("close").asDouble());
            formattedValues.add(entry);
        }
    
        result.put("values", formattedValues);
        return result;
    }

    private Map<String, Object> processTickerInfo(JsonNode jsonNode) {
        Map<String, Object> info = new HashMap<>();
        info.put("name", jsonNode.path("name").asText());
        info.put("symbol", jsonNode.path("symbol").asText());
        info.put("price", jsonNode.path("close").asDouble());
        info.put("currency", jsonNode.path("currency").asText());
        info.put("exchange", jsonNode.path("exchange").asText());
        info.put("country", jsonNode.path("country").asText());
        return info;
    }

        // Reusable API call method
    private JsonNode fetchTwelveData(String apiUrl) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            // Check for API errors
            if (rootNode.has("code") && rootNode.get("code").asInt() != 200) {
                int statusCode = rootNode.get("code").asInt();
                String errorMessage = "API Error: " + rootNode.path("message").asText();
                throw new TwelveDataApiException(statusCode, errorMessage); // Pass status code
            }

            return rootNode;
        } catch (Exception e) {
            // Handle generic errors (e.g., network issues)
            throw new TwelveDataApiException(500, "Failed to fetch data: " + e.getMessage());
        }
    }
}
