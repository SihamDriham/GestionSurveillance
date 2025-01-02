package com.ensaj.Gestion_surveillance.controller;

import com.ensaj.Gestion_surveillance.model.Module;
import com.ensaj.Gestion_surveillance.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/module")
public class ModuleRestController {

    @Autowired
    private ModuleService moduleService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Module>> getAllModules() {
        List<Module> modules = moduleService.getAllModules();
        return ResponseEntity.ok(modules);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Module> getModuleById(@PathVariable Long id) {
        Module module = moduleService.getModuleById(id);
        return ResponseEntity.ok(module);
    }

    @GetMapping("/allModule/{idOption}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Module>> getModuleByOption(@PathVariable Long idOption) {
        List<Module> modules = moduleService.findModuleByIdOption(idOption);
        return ResponseEntity.ok(modules);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Module> createModule(@RequestBody Module module) {
        Module newModule = moduleService.createModule(module);
        return ResponseEntity.ok(newModule);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Module> updateModule(@PathVariable Long id, @RequestBody Module moduleDetails) {
        Module updatedModule = moduleService.updateModule(id, moduleDetails);
        return ResponseEntity.ok(updatedModule);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.ok().build();
    }
}