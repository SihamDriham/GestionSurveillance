package com.ensaj.Gestion_surveillance.controller;

import com.ensaj.Gestion_surveillance.model.Examen;
import com.ensaj.Gestion_surveillance.service.ExamenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.sql.Time;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/examen")
public class ExamenRestController {

    @Autowired
    private ExamenService examenService;

    @GetMapping("/allExamen")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getAllExams() {
        List<Map<String, Object>> examen = examenService.getAllExamenWithDetails();
        return ResponseEntity.ok(examen);
    }

    @PostMapping("/save")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> ajouterExamen(@RequestBody Map<String, Object> requestBody) {
        Long idSession = ((Number) requestBody.get("id_session")).longValue();
        Long idOption = ((Number) requestBody.get("id_module")).longValue();
        Long idEnseignant = ((Number) requestBody.get("id_enseignant")).longValue();
        examenService.ajouterExamen(requestBody, idSession, idOption, idEnseignant);
        return ResponseEntity.ok("examen saved successfully");
    }

    @DeleteMapping("delete/{idExamen}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteExamen(@PathVariable Long idExamen) {
        examenService.deleteExamen(idExamen);
        return ResponseEntity.ok("Examen avec ID " + idExamen + " supprimé avec succès.");
    }

    @PostMapping("/examens")
    @PreAuthorize("isAuthenticated()")
    public List<Examen> getExamens(@RequestBody Map<String, Object> requestBody) {
        try {
            Long idSession = ((Number) requestBody.get("idSession")).longValue();
            String dateStr = (String) requestBody.get("date");
            String heureDebutStr = (String) requestBody.get("heureDebut");
            String heureFinStr = (String) requestBody.get("heureFin");

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date date = dateFormat.parse(dateStr);

            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
            Time heureDebut = new Time(timeFormat.parse(heureDebutStr).getTime());
            Time heureFin = new Time(timeFormat.parse(heureFinStr).getTime());

            return examenService.getExamensByIdSessionDateHeureDebutHeureFin(idSession, date, heureDebut, heureFin);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }


}
