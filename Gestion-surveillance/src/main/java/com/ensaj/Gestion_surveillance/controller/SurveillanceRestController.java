package com.ensaj.Gestion_surveillance.controller;

import java.time.LocalDateTime;
import java.util.List;

import com.ensaj.Gestion_surveillance.dto.SurveillanceDTO;
import com.ensaj.Gestion_surveillance.model.Surveillance;
import com.ensaj.Gestion_surveillance.repository.SurveillanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ensaj.Gestion_surveillance.dto.PlanificationRequest;
import com.ensaj.Gestion_surveillance.model.Examen;
import com.ensaj.Gestion_surveillance.service.SurveillanceServiceImp;

@RestController
@RequestMapping("/api/surveillance")
public class SurveillanceRestController {

    @Autowired
    private SurveillanceServiceImp surveillanceService;

    @Autowired
    private SurveillanceRepository surveillanceRepository;

    @PostMapping("/planifier")
    public ResponseEntity<String> planifierSurveillance(@RequestBody PlanificationRequest request) {
        Long id = request.getIdSession();
        try {
            surveillanceService.planifierSurveillanceParDepartement(id);
            return ResponseEntity.ok("Surveillance planifiée avec succès !");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur interne: " + e.getMessage());
        }
    }

    @GetMapping("/details")
    public ResponseEntity<List<SurveillanceDTO>> getAllSurveillancesWithDetails() {
        List<SurveillanceDTO> surveillances = surveillanceService.getAllSurveillancesWithDetails();
        return ResponseEntity.ok(surveillances);
    }
}