//package com.sicarus.util;
//
//import com.sicarus.model.UserRoles;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    // Gera uma key de 256-bits na inicialização da JVM
//    private static final Key SIGNING_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
//
//    @Value("${jwt.expiration}")
//    private long expiration;
//
//    public String generateToken(String username, UserRoles roles) {
//        return Jwts.builder()
//                .setSubject(username)
//                .claim("roles", roles)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + expiration))
//                .signWith(SIGNING_KEY)          // <-- aqui uso a key gerada
//                .compact();
//    }
//
//    public Claims extractClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(SIGNING_KEY)     // <-- e aqui também
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//}
//
;