package com.example.stock_portfolio.exception;

public class TwelveDataApiException extends RuntimeException {
    private final ErrorResponse errorResponse;

    public TwelveDataApiException(int statusCode, String message) {
        super(message);
        this.errorResponse = new ErrorResponse(statusCode, message);
    }

    public ErrorResponse getErrorResponse() {
        return errorResponse;
    }
}