package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.*;
import com.ensaj.Gestion_surveillance.model.Module;
import com.ensaj.Gestion_surveillance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class ExamenServiceImp implements ExamenService{

    @Autowired
    private ExamenRepository examenRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private ModuleRepository moduleRepository;
    

    @Autowired
    private LocauxRepository locauxRepository;

    @Override
    public List<Map<String, Object>> getAllExamenWithDetails() {
        List<Object[]> results = examenRepository.findAllExamens();
        List<Map<String, Object>> examens = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> examenData = new HashMap<>();
            examenData.put("date", row[1]);
            examenData.put("heureDebut", row[2]);
            examenData.put("heureFin", row[3]);
            examenData.put("nbEtudiant", row[4]);
            examenData.put("nomModule", row[7]);
            examenData.put("prenom", row[5]);
            examenData.put("nom", row[6]);
            examenData.put("idSession", row[0]);

            examens.add(examenData);
        }

        return examens;
    }

    @Override
    public List<Map<String, Object>> getExamenWithDetails(Long idSession, Date date, Time heureDebut, Time heureFin) {
        List<Object[]> results = examenRepository.findExamensWithdetails(idSession, date, heureDebut, heureFin);
        List<Map<String, Object>> examens = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> examenData = new HashMap<>();
            examenData.put("date", row[1]);
            examenData.put("heureDebut", row[2]);
            examenData.put("heureFin", row[3]);
            examenData.put("nomModule", row[6]);
            examenData.put("prenom", row[4]);
            examenData.put("nom", row[5]);
            examenData.put("idSession", row[0]);

            examens.add(examenData);
        }

        return examens;
    }


    @Override
    public void ajouterExamen(Map<String, Object> requestBody, Long idSession, Long idModule, Long idEnseignant) {

        Examen examen = new Examen();

        if (requestBody.containsKey("nbEtudiant")) {
            try {
                examen.setNbEtudiant(Integer.parseInt(requestBody.get("nbEtudiant").toString()));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Le champ 'nbEtudiant' doit être un entier.");
            }
        } else {
            throw new IllegalArgumentException("Le champ 'nbEtudiant' est obligatoire.");
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = null;
        try {
            date = dateFormat.parse((String) requestBody.get("date"));
        } catch (ParseException e) {
            throw new IllegalArgumentException("Format de date invalide, veuillez utiliser le format yyyy-MM-dd.");
        }

        examen.setDate(date);

        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

        try {
            if (requestBody.containsKey("heureDebut") && requestBody.containsKey("heureFin")) {
                examen.setHeureDebut(new Time(timeFormat.parse((String) requestBody.get("heureDebut")).getTime()));
                examen.setHeureFin(new Time(timeFormat.parse((String) requestBody.get("heureFin")).getTime()));
            }

        } catch (ParseException e) {
            throw new IllegalArgumentException("Format d'heure invalide, veuillez utiliser le format HH:mm:ss.");
        }

        Session session = sessionRepository.findById(idSession)
                .orElseThrow(() -> new RuntimeException("Type avec id " + idSession + " non trouvé"));
        examen.setSession(session);

        Module module = moduleRepository.findById(idModule)
                .orElseThrow(() -> new RuntimeException("Type avec id " + idModule + " non trouvé"));
        examen.setModule(module);

        Enseignant enseignant = enseignantRepository.findById(idEnseignant)
                .orElseThrow(() -> new RuntimeException("Type avec id " + idEnseignant + " non trouvé"));
        examen.setEnseignant(enseignant);
        
        List<Number> idLocauxRaw = (List<Number>) requestBody.get("idLocaux"); 
        List<Long> idLocaux = new ArrayList<>();

        if (idLocauxRaw != null) {
            for (Number idLocauxItem : idLocauxRaw) {
                idLocaux.add(idLocauxItem.longValue()); 
            }
        }

        List<Locaux> locauxList = new ArrayList<>();
        if (idLocaux != null) {
            for (Long idLocauxItem : idLocaux) {
                Locaux locaux = locauxRepository.findById(idLocauxItem)
                        .orElseThrow(() -> new RuntimeException("Locaux avec id " + idLocauxItem + " non trouvés"));
                locauxList.add(locaux);
            }
        }

        examen.setLocaux(locauxList);


        examenRepository.save(examen);
    }


    @Override
    public void deleteExamen(Long idExamen) {
        if (examenRepository.existsById(idExamen)) {
            examenRepository.deleteById(idExamen);
        } else {
            throw new RuntimeException("Examen avec l'ID " + idExamen + " n'existe pas.");
        }
    }

    @Override
    public List<Examen> getExamensByIdSessionDateHeureDebutHeureFin(Long idSession, Date date, Time heureDebut, Time heureFin) {
        return examenRepository.findExamensByIdSessionDateHeureDebutHeureFin(idSession, date, heureDebut, heureFin);
    }
    
    @Override
    public long countExamsBySessionId(Long idSession) {
        return examenRepository.countBySessionId(idSession);
    }

}
