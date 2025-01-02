package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Session;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface SessionService {

    List<Map<String, Object>> getAllSessionssWithDetails();

    Optional<Session> getSessionById(Long idSession);

    void ajouterSession(Map<String, Object> requestBody, Long idTypeSession);

    void deleteSession(Long idSession);

    List<Session> searchSessions(String search);

   void updateSession(Long idSession);

}
