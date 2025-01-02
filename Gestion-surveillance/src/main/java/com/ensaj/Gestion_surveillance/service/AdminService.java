package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.dto.LoginRequest;
import com.ensaj.Gestion_surveillance.dto.LoginResponse;

public interface AdminService {

    void saveAdmin(String username, String email, String rawPassword);

    LoginResponse authenticate(LoginRequest request);

}

