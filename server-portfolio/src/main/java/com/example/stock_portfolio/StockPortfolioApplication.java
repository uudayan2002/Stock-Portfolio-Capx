package com.example.stock_portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication // This annotation marks the main class of a Spring Boot application
@EnableScheduling // This annotation enables the scheduling of tasks in the application (e.g., to update stock prices)
public class StockPortfolioApplication {

    // Main method which serves as the entry point for the Spring Boot application
    public static void main(String[] args) {
        // Runs the Spring Boot application by passing in the main application class and command-line arguments
        SpringApplication.run(StockPortfolioApplication.class, args);
    }

}
