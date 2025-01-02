package com.ensaj.Gestion_surveillance.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final String base64Secret = "wq5rdGt3T1JFcGhyQ3JFTnpXMUZvR2FPQU5QQmZnYWs=";
    private final SecretKey key;
    private final long jwtExpiration = 1000 * 60 * 60 * 10; 

    public JwtUtil() {
        byte[] decodedKey = Base64.getDecoder().decode(base64Secret);
        if (decodedKey.length < 32) { 
            throw new IllegalArgumentException("La clé doit avoir une taille d'au moins 256 bits.");
        }
        this.key = new SecretKeySpec(decodedKey, 0, decodedKey.length, "HmacSHA256");
    }

    public String generateToken(String username, String email) {
        return Jwts.builder()
                .setSubject(email) 
                .claim("username", username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
