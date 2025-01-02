package com.ensaj.Gestion_surveillance.controller;

import com.ensaj.Gestion_surveillance.model.Locaux;
import com.ensaj.Gestion_surveillance.service.LocauxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/locaux")

public class LocauxRestController {

    @Autowired
    private LocauxService locauxService;

    @GetMapping("/allLocaux")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Locaux>> getAllLocaux() {
        List<Locaux> locaux = locauxService.getAllLocaux();
        locaux.sort(Comparator.comparing(Locaux::getTaille).reversed());
        return ResponseEntity.ok(locaux);
    }



    @PostMapping("/save")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> ajouterLocaux(@RequestBody Locaux locaux) {
        locauxService.ajouterLocaux(locaux);
        return ResponseEntity.ok("local saved successfully");
    }

    @GetMapping("/locaux/{idLocaux}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Optional<Locaux>> getLocauxById(@PathVariable Long idLocaux) {
        Optional<Locaux> local = locauxService.getLocauxById(idLocaux);
        return ResponseEntity.ok(local);
    }

    @DeleteMapping("delete/{idLocaux}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteLocaux(@PathVariable Long idLocaux) {
        locauxService.deleteLocaux(idLocaux);
        return ResponseEntity.ok("Locaux avec ID " + idLocaux + " supprimé avec succès.");
    }

    @PutMapping("/update/{idLocaux}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updateLocaux(@PathVariable Long idLocaux, @RequestBody Locaux updatedLocaux) {
        Optional<Locaux> optionalLocaux = locauxService.getLocauxById(idLocaux);
        if (optionalLocaux.isEmpty()) {
            return ResponseEntity.badRequest().body("Locaux introuvable avec l'ID : " + idLocaux);
        }
        Locaux existingLocaux = optionalLocaux.get();
        existingLocaux.setNomLocaux(updatedLocaux.getNomLocaux());
        existingLocaux.setTypeLocaux(updatedLocaux.getTypeLocaux());
        existingLocaux.setTaille(updatedLocaux.getTaille());
        locauxService.updateLocaux(idLocaux,existingLocaux);
        return ResponseEntity.ok("Locaux mis à jour avec succès.");
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> searchLocaux(
            @RequestParam(required = false) String search) {
        List<Locaux> locaux = locauxService.searchLocaux(search);

        if (locaux.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Aucun local trouvé pour la recherche : " + search);
        }

        return ResponseEntity.ok(locaux);
    }
}
