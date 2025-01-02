package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Session;
import com.ensaj.Gestion_surveillance.model.TypeSession;
import com.ensaj.Gestion_surveillance.repository.SessionRepository;
import com.ensaj.Gestion_surveillance.repository.TypeSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class SessionServiceImp implements SessionService{

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TypeSessionRepository typeSessionRepository;

    @Override
    public List<Map<String, Object>> getAllSessionssWithDetails() {
        List<Object[]> results = sessionRepository.findAllSessionsByType();
        List<Map<String, Object>> sessions = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> sessionData = new HashMap<>();
            sessionData.put("nomType", row[0]);
            sessionData.put("dateDebut", row[1]);
            sessionData.put("dateFin", row[2]);
            sessionData.put("heureDebut1", row[3]);
            sessionData.put("heureFin1", row[4]);
            sessionData.put("heureDebut2", row[5]);
            sessionData.put("heureFin2", row[6]);
            sessionData.put("heureDebut3", row[7]);
            sessionData.put("heureFin3", row[8]);
            sessionData.put("heureDebut4", row[9]);
            sessionData.put("heureFin4", row[10]);
            sessionData.put("idSession", row[11]);
            sessionData.put("valider", row[12]);

            sessions.add(sessionData);
        }

        return sessions;
    }

    @Override
    public Optional<Session> getSessionById(Long idSession) {
        return sessionRepository.findById(idSession);
    }


    @Override
    public void ajouterSession(Map<String, Object> requestBody, Long idTypeSession) {
        Session session = new Session();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date dateDebut = null;
        Date dateFin = null;
        try {
            dateDebut = dateFormat.parse((String) requestBody.get("date_debut"));
            dateFin = dateFormat.parse((String) requestBody.get("date_fin"));
        } catch (ParseException e) {
            throw new IllegalArgumentException("Format de date invalide, veuillez utiliser le format yyyy-MM-dd.");
        }

        session.setDateDebut(dateDebut);
        session.setDateFin(dateFin);

        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

        try {
            if (requestBody.containsKey("heureDebut1") && requestBody.containsKey("heureFin1")) {
                session.setHeureDebut1(new Time(timeFormat.parse((String) requestBody.get("heureDebut1")).getTime()));
                session.setHeureFin1(new Time(timeFormat.parse((String) requestBody.get("heureFin1")).getTime()));
            }

            if (requestBody.containsKey("heureDebut2") && requestBody.containsKey("heureFin2")) {
                session.setHeureDebut2(new Time(timeFormat.parse((String) requestBody.get("heureDebut2")).getTime()));
                session.setHeureFin2(new Time(timeFormat.parse((String) requestBody.get("heureFin2")).getTime()));
            }

            if (requestBody.containsKey("heureDebut3") && requestBody.containsKey("heureFin3")) {
                session.setHeureDebut3(new Time(timeFormat.parse((String) requestBody.get("heureDebut3")).getTime()));
                session.setHeureFin3(new Time(timeFormat.parse((String) requestBody.get("heureFin3")).getTime()));
            }

            if (requestBody.containsKey("heureDebut4") && requestBody.containsKey("heureFin4")) {
                session.setHeureDebut4(new Time(timeFormat.parse((String) requestBody.get("heureDebut4")).getTime()));
                session.setHeureFin4(new Time(timeFormat.parse((String) requestBody.get("heureFin4")).getTime()));
            }

        } catch (ParseException e) {
            throw new IllegalArgumentException("Format d'heure invalide, veuillez utiliser le format HH:mm:ss.");
        }

        TypeSession typeSession = typeSessionRepository.findById(idTypeSession)
                .orElseThrow(() -> new RuntimeException("Type avec id " + idTypeSession + " non trouvé"));
        session.setTypeSession(typeSession);

        sessionRepository.save(session);
    }


    @Override
    public void deleteSession(Long idSession) {
        if (sessionRepository.existsById(idSession)) {
            sessionRepository.deleteById(idSession);
        } else {
            throw new RuntimeException("Session avec l'ID " + idSession + " n'existe pas.");
        }
    }


    @Override
    public List<Session> searchSessions(String search) {
        if (search == null || search.trim().isEmpty()) {
            return sessionRepository.findAll();
        }

        return sessionRepository.searchSessions(search);
    }

    @Override
    public void updateSession(Long idSession) {
        Optional<Session> existingSession = sessionRepository.findById(idSession);
        if (existingSession.isPresent()) {
            Session s = existingSession.get();
            s.setValider(true);
            sessionRepository.save(s);
        }
    }
}
