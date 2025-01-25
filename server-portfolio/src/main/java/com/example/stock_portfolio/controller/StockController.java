package com.example.stock_portfolio.controller; // Package declaration for the StockController class

import com.example.stock_portfolio.dto.StockDto; // Importing StockDto class to handle stock data transfer
import com.example.stock_portfolio.service.StockService; // Importing StockService class to interact with the stock-related logic
import lombok.AllArgsConstructor; // Lombok annotation to generate the constructor with all fields
import org.springframework.http.HttpStatus; // Importing HttpStatus to define status codes in response
import org.springframework.http.ResponseEntity; // Importing ResponseEntity to send HTTP responses
import org.springframework.web.bind.annotation.PostMapping; // Importing PostMapping for creating stock
import org.springframework.web.bind.annotation.PutMapping; // Importing PutMapping for updating stock
import org.springframework.web.bind.annotation.RequestBody; // Importing RequestBody to bind HTTP request body to method argument
import org.springframework.web.bind.annotation.RequestMapping; // Importing RequestMapping to define base URI for REST controller
import org.springframework.web.bind.annotation.RestController; // Importing RestController to define a RESTful controller
import org.springframework.web.bind.annotation.DeleteMapping; // Importing DeleteMapping for deleting stock
import org.springframework.web.bind.annotation.GetMapping; // Importing GetMapping for retrieving data
import org.springframework.web.bind.annotation.PathVariable; // Importing PathVariable to map URI path variables to method parameters
import java.util.List; // Importing List for representing collections of StockDto
import java.util.Map; // Importing Map for representing key-value pairs of stock information

@AllArgsConstructor // Lombok annotation to generate constructor with all arguments (dependency injection)
@RestController // Marks this class as a RESTful controller
@RequestMapping("/api/stocks") // Sets the base URI for all endpoints in this controller
public class StockController {

    private final StockService stockService; // Declaring a StockService object to handle business logic

    // Create Stock endpoint (POST request)
    @PostMapping // Endpoint to create a new stock
    public ResponseEntity<StockDto> createStock(@RequestBody StockDto stockDto) {
        // Creating the stock using StockService and returning a response with HTTP status 201
        StockDto savedStock = stockService.createStock(stockDto);
        return new ResponseEntity<>(savedStock, HttpStatus.CREATED);
    }

    // Get Stock by ID endpoint (GET request)
    @GetMapping("{id}") // Endpoint to retrieve a stock by its ID
    public ResponseEntity<StockDto> getStockById(@PathVariable("id") Long stockId) {
        // Retrieving stock by ID from StockService and returning the stock in the response
        StockDto stockDto = stockService.getStockById(stockId);
        return ResponseEntity.ok(stockDto); // Returning HTTP status 200 with stock data
    }

    // Get All Stocks endpoint (GET request)
    @GetMapping // Endpoint to retrieve a list of all stocks
    public ResponseEntity<List<StockDto>> getAllStocks() {
        // Retrieving all stocks from StockService and returning them in the response
        List<StockDto> stock = stockService.getAllStocks();
        return ResponseEntity.ok(stock); // Returning HTTP status 200 with a list of stocks
    }

    // Update Stock endpoint (PUT request)
    @PutMapping("{id}") // Endpoint to update a stock by its ID
    public ResponseEntity<StockDto> updateStock(@PathVariable("id") Long stockId, 
                                                @RequestBody StockDto updatedStock) {
        // Updating stock using StockService and returning the updated stock in the response
        StockDto stockDto = stockService.updateStock(stockId, updatedStock);
        return ResponseEntity.ok(stockDto); // Returning HTTP status 200 with the updated stock data
    }

    // Delete Stock endpoint (DELETE request)
    @DeleteMapping("{id}") // Endpoint to delete a stock by its ID
    public ResponseEntity<String> deleteStock(@PathVariable("id") Long stockId) {
        // Deleting stock using StockService
        stockService.deleteStock(stockId);
        // Returning a response message indicating that the stock has been deleted
        return ResponseEntity.ok("Stock with id " + stockId + " has been deleted");
    }

    // Get Stock Historical Data endpoint (GET request)
    @GetMapping("/{ticker}/data") // Endpoint to retrieve historical data for a stock by its ticker symbol
    public ResponseEntity<Map<String, Object>> getStockHistoricalData(@PathVariable("ticker") String ticker) {
        // Retrieving historical data for the specified stock ticker and returning it in the response
        Map<String, Object> historicalData = stockService.getStockHistoricalData(ticker);
        return ResponseEntity.ok(historicalData); // Returning HTTP status 200 with the historical data
    }

    // Get Stock Ticker Info endpoint (GET request)
    @GetMapping("/{ticker}/info") // Endpoint to retrieve information about a stock ticker (company name, current price, etc.)
    public ResponseEntity<Map<String, Object>> getTickerInfo(@PathVariable("ticker") String ticker) {
        // Retrieving ticker information and returning it in the response
        Map<String, Object> tickerInfo = stockService.getTickerInfo(ticker);
        return ResponseEntity.ok(tickerInfo); // Returning HTTP status 200 with the ticker information
    }
}
