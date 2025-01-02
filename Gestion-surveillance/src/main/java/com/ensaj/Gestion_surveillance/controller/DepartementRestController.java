package com.ensaj.Gestion_surveillance.controller;

import com.ensaj.Gestion_surveillance.model.Departement;
import com.ensaj.Gestion_surveillance.service.DepartementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/departements")
public class DepartementRestController {

    @Autowired
    private DepartementService departementService;

    @GetMapping("/allDepartements")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Departement>> getAllDepartements() {
        List<Departement> departements = departementService.getAllDepartements();
        return ResponseEntity.ok(departements);
    }

    @PostMapping("/save")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> ajouterDepartement(@RequestBody
                                                     Departement departement) {
        departementService.ajouterDepartement(departement);
        return ResponseEntity.ok("departement saved successfully");
    }

    @GetMapping("/departement/{idDept}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Optional<Departement>> getDepartementById(@PathVariable Long idDept) {
        Optional<Departement> departement = departementService.getDepartementById(idDept);
        return ResponseEntity.ok(departement);
    }

    @DeleteMapping("delete/{idDept}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteDepartement(@PathVariable Long idDept) {
        departementService.deleteDepartement(idDept);
        return ResponseEntity.ok("Département avec ID " + idDept + " supprimé avec succès.");
    }

    @PutMapping("/update/{idDept}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updateDepartement(@PathVariable Long idDept, @RequestBody Departement updatedDepartement) {
        Optional<Departement> optionalDepartement = departementService.getDepartementById(idDept);
        if (optionalDepartement.isEmpty()) {
            return ResponseEntity.badRequest().body("Département introuvable avec l'ID : " + idDept);
        }
        Departement existingDepartement = optionalDepartement.get();
        existingDepartement.setNomDept(updatedDepartement.getNomDept());
        departementService.updateDepartement(idDept,existingDepartement);
        return ResponseEntity.ok("Département mis à jour avec succès.");
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> searchDepartements(@RequestParam(required = false) String search) {
        List<Departement> departements = departementService.searchDepartements(search);

        if (departements.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Aucun département trouvé pour la recherche : " + search);
            return ResponseEntity.badRequest().body(errorResponse);
        }

        return ResponseEntity.ok(departements);
    }

    @GetMapping("/count")
    @PreAuthorize("isAuthenticated()")
    public Long countDepartements() {
        return departementService.CountDepartements();
    }


}
