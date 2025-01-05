package com.ensaj.Gestion_surveillance.controller;

import com.ensaj.Gestion_surveillance.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ensaj.Gestion_surveillance.model.Module;

import java.util.List;

@RestController
@RequestMapping("/api/module")
public class ModuleRestController {

    @Autowired
    private ModuleService moduleService;

    @GetMapping("/allModule/{idOption}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Module>> getModuleByOption(@PathVariable Long idOption) {
        List<Module> module = moduleService.findModuleByIdOption(idOption);
        return ResponseEntity.ok(module);
    }

}
