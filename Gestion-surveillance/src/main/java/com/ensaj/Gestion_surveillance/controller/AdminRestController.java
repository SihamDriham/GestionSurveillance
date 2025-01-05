package com.ensaj.Gestion_surveillance.controller;

import com.ensaj.Gestion_surveillance.dto.LoginRequest;
import com.ensaj.Gestion_surveillance.dto.LoginResponse;
import com.ensaj.Gestion_surveillance.model.Admin;
import com.ensaj.Gestion_surveillance.service.AdminServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminRestController {

    @Autowired
    private AdminServiceImp authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody Admin adminRequest) {
        authService.saveAdmin(adminRequest.getUsername(), adminRequest.getEmail(), adminRequest.getPassword());
        return ResponseEntity.ok("Admin enregistré avec succès !");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }

}