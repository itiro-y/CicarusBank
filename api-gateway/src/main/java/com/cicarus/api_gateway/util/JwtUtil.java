package com.cicarus.api_gateway.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    public void validateToken(final String token){
        SecretKey key = Keys.hmacShaKeyFor(Base64.getEncoder().encode(secret.getBytes()));
        Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
    }
    
}
