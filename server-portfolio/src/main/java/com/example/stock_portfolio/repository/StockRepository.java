package com.example.stock_portfolio.repository;

import com.example.stock_portfolio.entity.Stocks;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository <Stocks, Long > {
}
