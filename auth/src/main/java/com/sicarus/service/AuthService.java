package com.sicarus.service;

import com.sicarus.dto.AuthRequest;
import com.sicarus.dto.AuthResponse;
import com.sicarus.entities.User;
import com.sicarus.repository.UserRepository;
import com.sicarus.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse authenticate(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getHashPassword())) {
            throw new BadCredentialsException("Senha inválida");
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token);
    }
}