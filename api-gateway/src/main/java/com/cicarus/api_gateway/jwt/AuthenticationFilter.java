package com.cicarus.api_gateway.jwt;

import com.cicarus.api_gateway.jwt.JwtUtil;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private final JwtUtil jwtUtil;

    public AuthenticationFilter(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // Bypass authentication for the login endpoint
            if (exchange.getRequest().getURI().getPath().equals("/auth/login")) {
                return chain.filter(exchange);
            }

            // Check for Authorization header
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing Authorization header");
            }

            String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    // Validate the token using JwtUtil
                    if (!jwtUtil.validateToken(token)) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
                    }
                    // Optionally, you can extract claims and add them to request headers for downstream services
                    // For example: exchange.getRequest().mutate().header("username", jwtUtil.extractUsername(token)).build();

                } catch (Exception e) {
                    System.err.println("JWT Validation Failed: " + e.getMessage());
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
                }
            } else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Authorization header format");
            }

            return chain.filter(exchange);
        };
    }

    public static class Config {
        // Put any configuration properties here if you need them
    }
}
