package com.sust.hall.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;

@Service

public class JwtUtils {
    private static final long EXP = 30*24*60*60*1000L;
    private SecretKey key;

    @Value("${secretJwtString}")
    private String secretJwtString;

    @PostConstruct
    private void init(){
        byte[] keyByte = secretJwtString.getBytes(StandardCharsets.UTF_8);
        key=new SecretKeySpec(keyByte, "hmacSHA256");
    }

    public String generateTokenK(String username){
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+EXP))  
                .signWith(key)
                .compact();
    }

    public String getUserNameFromToken(String token){
        return extractedClaims(token, Claims::getSubject);
    }

    private <T> T extractedClaims(String token, Function<Claims, T> claimsFunction  )
    {
        return claimsFunction.apply(Jwts.parser().verifyWith(key)
                    .build().parseSignedClaims(token)
                    .getPayload());
    }

    boolean isTokenValid(String token, UserDetails userdetails){
        final String username = getUserNameFromToken(token);
        return (username.equals(userdetails.getUsername()) && !isTokenValid(token));
    }

    private boolean isTokenValid(String token){
        return extractedClaims(token, Claims::getExpiration).before(new Date());
    }
}
