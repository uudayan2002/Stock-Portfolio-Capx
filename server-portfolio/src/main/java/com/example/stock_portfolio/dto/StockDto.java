package com.example.stock_portfolio.dto; // Package declaration for the StockDto class

import jakarta.persistence.Entity; // Importing JPA annotation to mark this class as an entity
import jakarta.persistence.GeneratedValue; // Importing JPA annotation for auto-generating value for the ID field
import jakarta.persistence.GenerationType; // Importing JPA annotation to specify the strategy for generating ID values
import jakarta.persistence.Id; // Importing JPA annotation to mark the ID field
import lombok.AllArgsConstructor; // Importing Lombok annotation to generate constructor with all parameters
import lombok.Getter; // Importing Lombok annotation to generate getter methods for fields
import lombok.NoArgsConstructor; // Importing Lombok annotation to generate no-argument constructor
import lombok.Setter; // Importing Lombok annotation to generate setter methods for fields

@Entity // Marks this class as a JPA entity
@Getter // Generates getter methods for all fields
@Setter // Generates setter methods for all fields
@NoArgsConstructor // Generates a no-argument constructor
@AllArgsConstructor // Generates a constructor with arguments for all fields
public class StockDto {

    @Id // Marks this field as the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates the value of this field with an incremental strategy
    private Long id; // Unique identifier for each stock DTO record

    private String stockName; // Name of the stock (e.g., 'Tesla')

    private String ticker; // The ticker symbol for the stock (e.g., 'TSLA')

    private Long quantity; // Number of shares owned for this stock

    private Double buyPrice; // The price at which the stock was bought

    private Double currentPrice; // The current market price of the stock
}
