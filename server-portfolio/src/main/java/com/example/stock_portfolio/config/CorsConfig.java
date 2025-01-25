package com.example.stock_portfolio.config;

import org.springframework.context.annotation.Bean; // Importing Bean annotation to define a bean in the Spring context
import org.springframework.context.annotation.Configuration; // Importing Configuration annotation to mark the class as a configuration class
import org.springframework.web.servlet.config.annotation.CorsRegistry; // Importing CorsRegistry to define CORS configuration
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer; // Importing WebMvcConfigurer for customizing Spring MVC configuration

// This class is used to configure CORS (Cross-Origin Resource Sharing) settings for the application
@Configuration
public class CorsConfig {

    // Defining a bean to configure CORS settings for the application
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Mapping CORS for all routes (/**)
                registry.addMapping("/**")
                        // Allowing specific origins for cross-origin requests
                        .allowedOriginPatterns("https://portfoliostock.netlify.app", "http://localhost:5173")
                        // Allowing specific HTTP methods for cross-origin requests
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        // Allowing all headers in the request
                        .allowedHeaders("*")
                        // Allowing credentials (cookies, HTTP authentication, etc.)
                        .allowCredentials(true);
            }
        };
    }
}
