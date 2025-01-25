package com.example.stock_portfolio.config;

import org.springframework.boot.web.client.RestTemplateBuilder; // Importing RestTemplateBuilder for building RestTemplate
import org.springframework.context.annotation.Bean; // Importing Bean annotation to define a bean in the Spring context
import org.springframework.context.annotation.Configuration; // Importing Configuration annotation to mark the class as a configuration class
import org.springframework.web.client.RestTemplate; // Importing RestTemplate class for making HTTP requests

// This class is used to configure Spring beans for the application
@Configuration
public class AppConfig {

    // Defining a bean of type RestTemplate so that it can be injected wherever needed in the application
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build(); // Returning a new RestTemplate instance built using RestTemplateBuilder
    }
}
