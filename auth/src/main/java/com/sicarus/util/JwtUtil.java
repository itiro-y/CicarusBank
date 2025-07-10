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
//import javax.crypto.SecretKey;
//import java.security.Key;
//import java.util.Base64;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    // Gera uma key de 256-bits na inicialização da JVM
////    private static final Key SIGNING_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
//
//    // Inject the secret from application.yaml
//    @Value("${jwt.secret}")
//    private String secret;
//
//    @Value("${jwt.expiration}")
//    private long expiration;
//
//    private SecretKey getKey() {
//        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
//    }
//
//    public String generateToken(String username, UserRoles roles) {
//        return Jwts.builder()
//                .setSubject(username)
//                .claim("roles", roles)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + expiration))
//                .signWith(getKey())          // <-- aqui uso a key gerada
//                .compact();
//    }
//
//    public Claims extractClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(getKey())     // <-- e aqui também
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//}
//
package com.sicarus.util;

import com.sicarus.model.UserRoles;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getKey() {
        // This part is correct: decode the Base64 secret
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
    }

    public String generateToken(String username, UserRoles roles) {
        return Jwts.builder()
                .setSubject(username) // Use setSubject instead of subject
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())
                .compact();
    }

    public Claims extractClaims(String token) {
        // Use setSigningKey and parseClaimsJws for older versions
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}