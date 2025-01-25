package com.example.stock_portfolio.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// This class is responsible for handling exceptions globally across the application.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle ResourceNotFoundException (custom exception when resource is not found)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        // Create an ErrorResponse object for the exception
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(), // Set the status code (404 Not Found)
            ex.getMessage() // Set the exception message as the error message
        );
        // Return the error response with status 404 (Not Found)
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // Handle TwelveDataApiException (custom exception for API-related errors)
    @ExceptionHandler(TwelveDataApiException.class)
    public ResponseEntity<ErrorResponse> handleTwelveDataApiException(TwelveDataApiException ex) {
        // Get the ErrorResponse directly from the TwelveDataApiException
        ErrorResponse errorResponse = ex.getErrorResponse();
        
        // Use the status code from the ErrorResponse and return it with the appropriate status
        return ResponseEntity.status(errorResponse.getStatusCode()).body(errorResponse);
    }
}
