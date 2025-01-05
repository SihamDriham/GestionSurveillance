package com.ensaj.Gestion_surveillance.controller;

import com.ensaj.Gestion_surveillance.model.Enseignant;
import com.ensaj.Gestion_surveillance.service.EnseignantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/enseignants")
public class EnseignantController {

    @Autowired
    private EnseignantService enseignantService;

    @GetMapping("/allEnsegnant/{idDept}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Enseignant>> getEnseignantsByDepartement(@PathVariable Long idDept) {
        List<Enseignant> enseignants = enseignantService.findEnseignantsByIdDept(idDept);
        return ResponseEntity.ok(enseignants);
    }

    @PostMapping("/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Enseignant> addEnseignant(@RequestBody Enseignant enseignant) {
        try {
            Enseignant newEnseignant = enseignantService.saveEnseignant(enseignant);
            return ResponseEntity.status(201).body(newEnseignant); // Retourne l'enseignant ajouté
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null); // En cas d'erreur, retourne une erreur 400
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Enseignant> updateEnseignant(@PathVariable Long id, @RequestBody Enseignant enseignantDetails) {
        try {
            Optional<Enseignant> existingEnseignant = enseignantService.findEnseignantById(id);
            if (existingEnseignant.isPresent()) {
                Enseignant enseignant = existingEnseignant.get();
                enseignant.setNom(enseignantDetails.getNom());
                enseignant.setPrenom(enseignantDetails.getPrenom());
                enseignant.setEmail(enseignantDetails.getEmail());
                enseignant.setDisponse(enseignantDetails.getDisponse());
                enseignant.setDepartement(enseignantDetails.getDepartement());

                Enseignant updatedEnseignant = enseignantService.saveEnseignant(enseignant);
                return ResponseEntity.ok(updatedEnseignant);
            } else {
                return ResponseEntity.status(404).build(); // Si l'enseignant n'existe pas
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).build(); // En cas d'erreur
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteEnseignant(@PathVariable Long id) {
        try {
            Optional<Enseignant> enseignant = enseignantService.findEnseignantById(id);
            if (enseignant.isPresent()) {
                enseignantService.deleteEnseignant(id);
                return ResponseEntity.ok().build(); // Retourne un statut 200 si l'enseignant est supprimé
            } else {
                return ResponseEntity.status(404).build(); // Retourne 404 si l'enseignant n'est pas trouvé
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).build(); // En cas d'erreur, retourne une erreur 400
        }
    }


    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> searchEnseignants(@RequestParam(required = false) String search) {
        List<Enseignant> enseignants = enseignantService.searchEnseignants(search);

        if (enseignants.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Aucun enseignant trouvé pour la recherche : " + search);
            return ResponseEntity.badRequest().body(errorResponse);
        }

        return ResponseEntity.ok(enseignants);
    }

    @GetMapping("/count")
    @PreAuthorize("isAuthenticated()")
    public Long countEnseignants() {
        return enseignantService.CountEnsaigant();
    }

}