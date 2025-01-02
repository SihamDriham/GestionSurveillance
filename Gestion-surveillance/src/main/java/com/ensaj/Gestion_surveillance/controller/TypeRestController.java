package com.ensaj.Gestion_surveillance.controller;

import com.ensaj.Gestion_surveillance.model.TypeSession;
import com.ensaj.Gestion_surveillance.service.TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/type")
public class TypeRestController {

    @Autowired
    private TypeService typeService;

    @GetMapping("/allType")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TypeSession>> getAllDepartements() {
        List<TypeSession> type = typeService.getAllType();
        return ResponseEntity.ok(type);
    }

}
