package com.example.stock_portfolio.repository;

import com.example.stock_portfolio.entity.Stocks; // Importing the Stocks entity class
import org.springframework.data.jpa.repository.JpaRepository; // Importing JpaRepository to handle CRUD operations

// StockRepository interface extends JpaRepository to handle database operations for Stocks entities
public interface StockRepository extends JpaRepository<Stocks, Long> {
    // JpaRepository already provides basic CRUD operations like save, findById, findAll, deleteById, etc.
    // Custom queries can be added if necessary in the future.
}
