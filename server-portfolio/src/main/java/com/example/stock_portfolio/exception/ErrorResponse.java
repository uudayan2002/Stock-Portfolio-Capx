package com.example.stock_portfolio.exception;

// This class represents the structure of an error response.
public class ErrorResponse {
    private int statusCode; // HTTP status code for the error
    private String message; // The error message to be displayed

    // Constructor to initialize the error response with a status code and message
    public ErrorResponse(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
    }

    // Getter for the status code
    public int getStatusCode() {
        return statusCode;
    }

    // Setter for the status code
    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    // Getter for the message
    public String getMessage() {
        return message;
    }

    // Setter for the message
    public void setMessage(String message) {
        this.message = message;
    }
}
