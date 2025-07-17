package com.sicarus.service;

import com.sicarus.dto.AuthRequest;
import com.sicarus.dto.AuthResponse;
import com.sicarus.dto.UserCreateRequest;
import com.sicarus.model.UserRoles;
import com.sicarus.model.User;
import com.sicarus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse authenticate(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Usuário não encontrado."));

        if (!passwordEncoder.matches(request.getPassword(), user.getHashPassword())) {
            throw new BadCredentialsException("Senha inválida.");
        }

        // gera o token com o JwtUtil atualizado
        String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());
        return new AuthResponse(token);
    }

    public void createUser(UserCreateRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setHashPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(UserRoles.ROLE_USER); 

        userRepository.save(user);
    }

}
