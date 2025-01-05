package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Examen;

import java.sql.Time;
import java.util.Date;
import java.util.List;
import java.util.Map;

public interface ExamenService {

    List<Map<String, Object>> getAllExamenWithDetails();

    void ajouterExamen(Map<String, Object> requestBody, Long idSession, Long idModule, Long idEnseignant);

    void deleteExamen(Long idExamen);

    List<Map<String, Object>> getExamenWithDetails(Long idSession, Date date, Time heureDebut, Time heureFin);

    List<Examen> getExamensByIdSessionDateHeureDebutHeureFin(Long idSession, Date date, Time heureDebut, Time HeureFin);
}
