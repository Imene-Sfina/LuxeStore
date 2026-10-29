package com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository repo;
    private final JwtService jwtService;
    private final PasswordEncoder encoder;

    public AuthController(UserRepository repo, JwtService jwtService, PasswordEncoder encoder) {
        this.repo = repo;
        this.jwtService = jwtService;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (repo.findByEmail(req.getEmail()).isPresent())
            return ResponseEntity.badRequest().body("Email déjà utilisé");

        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setRole("USER"); // par défaut
        repo.save(u);
        return ResponseEntity.ok("Compte créé");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User u = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Email introuvable"));

        if (!encoder.matches(req.getPassword(), u.getPassword()))
            return ResponseEntity.badRequest().body("Mot de passe incorrect");

        String token = jwtService.generateToken(u.getEmail());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "role", u.getRole(),
            "name", u.getName()
        ));
    }
}