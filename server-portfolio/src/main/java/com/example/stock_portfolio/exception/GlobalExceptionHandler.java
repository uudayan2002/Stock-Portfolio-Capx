package com.example.stock_portfolio.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle ResourceNotFoundException (your existing code)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // Handle TwelveDataApiException (new handler)
    @ExceptionHandler(TwelveDataApiException.class)
    public ResponseEntity<ErrorResponse> handleTwelveDataApiException(TwelveDataApiException ex) {
        // Get the ErrorResponse directly from the exception
        ErrorResponse errorResponse = ex.getErrorResponse();
        
        // Use the status code from the ErrorResponse
        return ResponseEntity.status(errorResponse.getStatusCode()).body(errorResponse);
    }
}