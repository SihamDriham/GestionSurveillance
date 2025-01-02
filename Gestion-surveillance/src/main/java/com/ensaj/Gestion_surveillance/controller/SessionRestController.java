package com.ensaj.Gestion_surveillance.controller;

import com.ensaj.Gestion_surveillance.model.Session;
import com.ensaj.Gestion_surveillance.service.ExcelService;
import com.ensaj.Gestion_surveillance.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/session")
public class SessionRestController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private ExcelService excelService;

    @GetMapping("/allSessions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getAllSessions() {
        List<Map<String, Object>> session = sessionService.getAllSessionssWithDetails();
        return ResponseEntity.ok(session);
    }

    @GetMapping("/session/{idSession}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Optional<Session>> getSessionByid(@PathVariable Long idSession) {
        Optional<Session> session = sessionService.getSessionById(idSession);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/save")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> ajouterSession(@RequestBody Map<String, Object> requestBody) {
        Long idTypeSession = ((Number) requestBody.get("id_type_session")).longValue();
        sessionService.ajouterSession(requestBody, idTypeSession);
        return ResponseEntity.ok("session saved successfully");
    }

    @DeleteMapping("delete/{idSession}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteDepartement(@PathVariable Long idSession) {
        sessionService.deleteSession(idSession);
        return ResponseEntity.ok("Session avec ID " + idSession + " supprimé avec succès.");
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> searchSessions(
            @RequestParam(required = false) String search) {
        List<Session> sessions = sessionService.searchSessions(search);

        if (sessions.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Aucune session trouvée pour la recherche : " + search);
        }

        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/uploadExcel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> uploadExcelFile(@RequestParam("file") MultipartFile file) {
        try {
            excelService.importDataFromExcel(file);
            return ResponseEntity.ok("Fichier importé avec succès !");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'importation du fichier : " + e.getMessage());
        }
    }

    @PutMapping("/update/{idSession}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updateSession(@PathVariable Long idSession) {
        Optional<Session> optionalSession = sessionService.getSessionById(idSession);
        if (optionalSession.isEmpty()) {
            return ResponseEntity.badRequest().body("Session introuvable avec l'ID : " + idSession);
        }
        sessionService.updateSession(idSession);
        return ResponseEntity.ok("Session mis à jour avec succès.");
    }

}

