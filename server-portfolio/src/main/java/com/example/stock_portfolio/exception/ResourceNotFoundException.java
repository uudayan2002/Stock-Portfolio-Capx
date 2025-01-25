package com.example.stock_portfolio.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Custom exception class for resource not found, returns a 404 status automatically.
@ResponseStatus(value = HttpStatus.NOT_FOUND) // Automatically maps to 404 Not Found response
public class ResourceNotFoundException extends RuntimeException {

    // Constructor to initialize the exception with a custom message
    public ResourceNotFoundException(String message) {
        super(message); // Passes the message to the parent RuntimeException constructor
    }
}
