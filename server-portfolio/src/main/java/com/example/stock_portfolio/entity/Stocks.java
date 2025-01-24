package com.example.stock_portfolio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "stock")
public class Stocks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stock_name", nullable = false, unique = true)
    private String stockName;

    @Column(name = "ticker")
    private String ticker;

    @Column(name = "quantity")
    private Long quantity;

    @Column(name = "buy_price")
    private Double buyPrice;

    @Column(name = "current_price")
    private Double currentPrice;
}
