package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.dto.LoginRequest;
import com.ensaj.Gestion_surveillance.dto.LoginResponse;
import com.ensaj.Gestion_surveillance.model.Admin;
import com.ensaj.Gestion_surveillance.repository.AdminRepository;
import com.ensaj.Gestion_surveillance.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminServiceImp implements AdminService{

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void saveAdmin(String username, String email, String rawPassword) {
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(rawPassword));
        adminRepository.save(admin);
    }

    public LoginResponse authenticate(LoginRequest request) {
        Optional<Admin> admin = adminRepository.findByEmail(request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtUtil.generateToken(admin.get().getUsername(), request.getEmail());
        return new LoginResponse(token);

    }
}


