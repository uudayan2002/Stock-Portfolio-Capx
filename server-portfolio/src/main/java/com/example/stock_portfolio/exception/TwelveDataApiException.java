package com.example.stock_portfolio.exception;

public class TwelveDataApiException extends RuntimeException {
    
    private final ErrorResponse errorResponse; // Holds the error response details

    // Constructor to initialize the exception with status code and message
    public TwelveDataApiException(int statusCode, String message) {
        super(message); // Pass the message to the parent RuntimeException constructor
        this.errorResponse = new ErrorResponse(statusCode, message); // Create an ErrorResponse object
    }

    // Getter method to access the error response details
    public ErrorResponse getErrorResponse() {
        return errorResponse;
    }
}
