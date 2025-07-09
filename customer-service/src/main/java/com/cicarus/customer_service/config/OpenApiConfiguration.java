package com.cicarus.customer_service.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Customer Microservice", version = "v1", description = "Documentation of Customer Microservice API"))
public class OpenApiConfiguration {

    @Bean
    public OpenAPI customersApi() {
        return new OpenAPI()
                .components(new Components())
                .info(new io.swagger.v3.oas.models.info.Info()
                .title("Customer Microservice")
                        .version("1.0")
                        .description("API for customer management operations"));
    }
}
