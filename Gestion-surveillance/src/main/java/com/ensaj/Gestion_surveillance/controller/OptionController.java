package com.ensaj.Gestion_surveillance.controller;

import com.ensaj.Gestion_surveillance.model.Option;
import com.ensaj.Gestion_surveillance.service.OptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/option")
public class OptionController {

    @Autowired
    private OptionService optionService;

    @GetMapping("/allOption")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Option>> getAllOption() {
        List<Option> option = optionService.getAllOption();
        return ResponseEntity.ok(option);
    }

    @PostMapping("/save")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> ajouterOption(@RequestBody Option option) {
        optionService.ajouterOption(option);
        return ResponseEntity.ok("option saved successfully");
    }

    @GetMapping("/option/{idOption}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Optional<Option>> getOptionById(@PathVariable Long idOption) {
        Optional<Option> option = optionService.getOptionById(idOption);
        return ResponseEntity.ok(option);
    }

    @DeleteMapping("delete/{idOption}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteOption(@PathVariable Long idOption) {
        optionService.deleteOption(idOption);
        return ResponseEntity.ok("Option avec ID " + idOption + " supprimé avec succès.");
    }

    @PutMapping("/update/{idOption}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updateOption(@PathVariable Long idOption, @RequestBody Option updatedOption) {
        Optional<Option> optionalOption = optionService.getOptionById(idOption);
        if (optionalOption.isEmpty()) {
            return ResponseEntity.badRequest().body("Option introuvable avec l'ID : " + idOption);
        }
        Option existingOption = optionalOption.get();
        existingOption.setNomOption(updatedOption.getNomOption());
        optionService.updateOption(idOption,existingOption);
        return ResponseEntity.ok("Option mis à jour avec succès.");
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> searchOption(@RequestParam(required = false) String search) {
        List<Option> options = optionService.searchOption(search);

        if (options.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Aucun option trouvé pour la recherche : " + search);
            return ResponseEntity.badRequest().body(errorResponse);
        }

        return ResponseEntity.ok(options);
    }

}
