package com.cicarus.api_gateway.filter;
import com.cicarus.api_gateway.util.JwtUtil;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
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
            // 1. Check if the Authorization header is present
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                throw new HttpClientErrorException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Missing authorization header");
            }

            // 2. Extract and validate the token
            String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    jwtUtil.validateToken(token);
                } catch (Exception e) {
//                    throw new HttpClientErrorException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid or expired token");
                    // THIS LINE WILL PRINT THE REAL ERROR TO THE CONSOLE
                    System.err.println("JWT Validation Failed: " + e.getMessage());

                    // You can keep this line to return the 401 to the client
                    throw new HttpClientErrorException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid or expired token");

                }
            }

            // 3. If valid, proceed to the next filter in the chain
            return chain.filter(exchange);
        };
    }

    public static class Config {
        // Put any configuration properties here if you need them
    }
}