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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Email ja cadastrado"));
        }

        Usuario usuario = Usuario.builder()
                .nome(req.getNome())
                .email(req.getEmail())
                .senha(passwordEncoder.encode(req.getSenha()))
                .build();

        String token = jwtUtil.generateToken(usuario);
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(new AuthResponse(token, usuario.getNome(), usuario.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByEmail(req.getEmail());
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("erro", "Email ou senha invalidos"));
        }

        Usuario usuario = optionalUsuario.get();
        String senhaDigitada = req.getSenha();
        String senhaArmazenada = usuario.getSenha();

        boolean senhaValida;
        if (isBcryptHash(senhaArmazenada)) {
            senhaValida = passwordEncoder.matches(senhaDigitada, senhaArmazenada);
        } else {
            // Compatibilidade com base antiga sem hash; migra para BCrypt apos login valido.
            senhaValida = senhaDigitada.equals(senhaArmazenada);
            if (senhaValida) {
                usuario.setSenha(passwordEncoder.encode(senhaDigitada));
                usuarioRepository.save(usuario);
            }
        }

        if (!senhaValida) {
            return ResponseEntity.status(401).body(Map.of("erro", "Email ou senha invalidos"));
        }

        String token = jwtUtil.generateToken(usuario);
        return ResponseEntity.ok(new AuthResponse(token, usuario.getNome(), usuario.getEmail()));
    }

    private boolean isBcryptHash(String senha) {
        return senha != null && (senha.startsWith("$2a$") || senha.startsWith("$2b$") || senha.startsWith("$2y$"));
    }
}
