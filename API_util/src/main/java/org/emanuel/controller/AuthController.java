package org.emanuel.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.emanuel.dto.AuthResponse;
import org.emanuel.dto.LoginRequest;
import org.emanuel.dto.RegisterRequest;
import org.emanuel.model.Usuario;
import org.emanuel.repository.UsuarioRepository;
import org.emanuel.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Email ja cadastrado"));
        }

        Usuario usuario = Usuario.builder()
                .nome(req.getNome())
                .email(req.getEmail())
                .senha(passwordEncoder.encode(req.getSenha()))
                .build();

        usuarioRepository.save(usuario);
        String token = jwtUtil.generateToken(usuario);
        return ResponseEntity.ok(new AuthResponse(token, usuario.getNome(), usuario.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getSenha())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("erro", "Email ou senha invalidos"));
        }

        Usuario usuario = usuarioRepository.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(usuario);
        return ResponseEntity.ok(new AuthResponse(token, usuario.getNome(), usuario.getEmail()));
    }
}
