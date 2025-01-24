package com.example.stock_portfolio.controller;

import com.example.stock_portfolio.dto.StockDto;
import com.example.stock_portfolio.service.StockService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.Map;



@AllArgsConstructor
@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    //Build Create Stocks REST API
    @PostMapping
    public ResponseEntity<StockDto> createStock (@RequestBody StockDto stockDto){
        StockDto savedStock = stockService.createStock(stockDto);
        return new ResponseEntity<>(savedStock, HttpStatus.CREATED);
    }

    //Build Get Stocks by id REST API
    @GetMapping("{id}")
    public ResponseEntity<StockDto> getStockById(@PathVariable("id") Long stockId){
        StockDto stockDto = stockService.getStockById(stockId);
        return ResponseEntity.ok(stockDto);
    }

    //Build Get All Stocks REST API
    @GetMapping
    public ResponseEntity<List<StockDto>> getAllStocks(){
        List<StockDto> stock = stockService.getAllStocks();
        return ResponseEntity.ok(stock);
    }

    //Build Update Stocks REST API
    @PutMapping("{id}")
    public ResponseEntity<StockDto> updateStock(@PathVariable("id") Long stockId, 
                                            @RequestBody StockDto updatedStock){
        StockDto stockDto = stockService.updateStock(stockId, updatedStock);
        return ResponseEntity.ok(stockDto);
    }

    //Build delete Stocks REST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteStock(@PathVariable("id") Long stockId){
        stockService.deleteStock(stockId);
        return ResponseEntity.ok("Stock with id "+ stockId +" has been deleted");
    }

    @GetMapping("/{ticker}/data")
    public ResponseEntity<Map<String, Object>> getStockHistoricalData(
            @PathVariable("ticker") String ticker
    ) {
        Map<String, Object> historicalData = stockService.getStockHistoricalData(ticker);
        return ResponseEntity.ok(historicalData);
    }

    // New endpoint for ticker metadata (company name, current price)
    @GetMapping("/{ticker}/info")
    public ResponseEntity<Map<String, Object>> getTickerInfo(
            @PathVariable("ticker") String ticker
    ) {
        Map<String, Object> tickerInfo = stockService.getTickerInfo(ticker);
        return ResponseEntity.ok(tickerInfo);
    }
}
