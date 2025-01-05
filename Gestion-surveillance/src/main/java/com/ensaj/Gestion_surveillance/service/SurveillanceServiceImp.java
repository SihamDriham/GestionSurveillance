package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.dto.SurveillanceDTO;
import com.ensaj.Gestion_surveillance.model.*;
import com.ensaj.Gestion_surveillance.repository.EnseignantRepository;
import com.ensaj.Gestion_surveillance.repository.ExamenRepository;
import com.ensaj.Gestion_surveillance.repository.LocauxRepository;
import com.ensaj.Gestion_surveillance.repository.SurveillanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SurveillanceServiceImp {

    private static final Logger LOGGER = LoggerFactory.getLogger(SurveillanceServiceImp.class);

    @Autowired
    private SurveillanceRepository surveillanceRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;
    @Autowired
    private EnseignantService enseignantService;
    @Autowired
    private LocauxRepository locauxRepository;
    @Autowired
    private ExamenRepository examenRepository ;

    @Autowired
    private SessionService sessionService;

    private static final int NOMBRE_RESERVISTES = 10;


    public List<SurveillanceDTO> getAllSurveillancesWithDetails() {
        List<Surveillance> surveillances = surveillanceRepository.findAll();
        List<SurveillanceDTO> surveillanceDTOs = new ArrayList<>();

        for (Surveillance surveillance : surveillances) {
            SurveillanceDTO dto = mapToDTO(surveillance);
            surveillanceDTOs.add(dto);
        }

        return surveillanceDTOs;
    }

    private SurveillanceDTO mapToDTO(Surveillance surveillance) {
        SurveillanceDTO dto = new SurveillanceDTO();
        dto.setDate(surveillance.getDate());
        dto.setHeureDebut(surveillance.getHeureDebut());
        dto.setHeureFin(surveillance.getHeureFin());

        // Récupération des noms via les repositories
        dto.setLocauxNom(
                locauxRepository.findById(surveillance.getIdLocaux())
                        .map(locaux -> locaux.getNomLocaux())
                        .orElse("Locaux non trouvé")
        );

        dto.setSurveillantNom( enseignantRepository.findById(surveillance.getIdSurveillant())
                .map(surveillant -> surveillant.getNom())
                .orElse("Surveillant non trouvé")
        );

        dto.setReservisteNom(
                surveillance.getIdReserviste() != null
                        ? enseignantRepository.findById(surveillance.getIdReserviste())
                        .map(reserviste -> reserviste.getNom())
                        .orElse("Reserviste non trouvé")
                        : "Aucun réserviste"
        );
        dto.setReservistePrenom(
                surveillance.getIdReserviste() != null
                        ? enseignantRepository.findById(surveillance.getIdReserviste())
                        .map(reserviste -> reserviste.getPrenom())
                        .orElse("Reserviste non trouvé")
                        : "Aucun réserviste"
        );
        dto.setSurveillantPrenom(enseignantRepository.findById(surveillance.getIdSurveillant())
                .map(surveillant -> surveillant.getPrenom())
                .orElse("Surveillant non trouvé"));

        dto.setExamenNom(
                examenRepository.findById(surveillance.getIdExamen())
                        .map(examen -> examen.getModule().getNomModule())
                        .orElse("Examen non trouvé")
        );

        return dto;
    }


//    @Autowired
//    public SurveillanceServiceImp(
//            SurveillanceRepository surveillanceRepository,
//            EnseignantService enseignantService,
//            LocauxService locauxService,
//            SessionService sessionService) {
//        this.surveillanceRepository = surveillanceRepository;
//        this.enseignantService = enseignantService;
//        this.locauxService = locauxService;
//        this.sessionService = sessionService;
//    }

    public boolean planifierSurveillanceParDepartement(Long idSession) {
        try {
            LOGGER.info("Début de la planification de la surveillance pour la session ID: {}", idSession);
            Session session = sessionService.getSessionById(idSession)
                    .orElseThrow(() -> new RuntimeException("Session introuvable"));

            List<Examen> examens = session.getExamens();
            List<Enseignant> enseignants = enseignantService.getAllEnseignant();
            if (enseignants.isEmpty()) {
                throw new RuntimeException("Aucun enseignant disponible.");
            }

            Map<Long, Map<LocalDate, Set<DemiJournee>>> surveillanceParJour = new HashMap<>();
            Map<Long, Integer> surveillanceCount = new HashMap<>();
            Map<Long, Integer> reservisteCount = new HashMap<>();

            enseignants.forEach(e -> {
                surveillanceParJour.put(e.getId(), new HashMap<>());
                surveillanceCount.put(e.getId(), 0);
                reservisteCount.put(e.getId(), 0);
            });

            List<Surveillance> surveillancesPlanifiees = new ArrayList<>();

            examens.sort(Comparator.comparing(Examen::getDate).thenComparing(Examen::getHeureDebut));

            for (Examen examen : examens) {
                Date examDate = examen.getDate();
                LocalDate dateExamen = LocalDate.from(examDate.toInstant().atZone(TimeZone.getDefault().toZoneId()));
                LocalTime heureDebut = examen.getHeureDebut().toLocalTime();
                DemiJournee demiJournee = determinerDemiJournee(heureDebut);

                List<Enseignant> reservistes = selectionnerReservistes(enseignants);
                LOGGER.info("Réservistes sélectionnés pour l'examen ID {}: {}", examen.getIdExamen(), reservistes);

                for (Locaux locaux : examen.getLocaux()) {
                    int surveillantsNecessaires = calculerSurveillantsNecessaires(locaux.getTaille());
                    LOGGER.info("Surveillants nécessaires pour le local ID {}: {}", locaux.getIdLocaux(), surveillantsNecessaires);

                    List<Enseignant> surveillants = selectionnerSurveillants(
                            enseignants,
                            surveillanceCount,
                            surveillanceParJour,
                            dateExamen,
                            demiJournee,
                            surveillantsNecessaires,
                            reservistes
                    );

                    if (surveillants.size() < surveillantsNecessaires) {
                        throw new RuntimeException("Nombre insuffisant de surveillants disponibles pour l'examen " +
                                examen.getIdExamen() + " et le local " + locaux.getIdLocaux());
                    }

                    for (Enseignant surveillant : surveillants) {
                        Surveillance surveillance = new Surveillance();
                        surveillance.setDate(examen.getDate());
                        surveillance.setHeureDebut(examen.getHeureDebut());
                        surveillance.setHeureFin(examen.getHeureFin());
                        surveillance.setIdLocaux(locaux.getIdLocaux());
                        surveillance.setIdSurveillant(surveillant.getId());
                        surveillance.setIdExamen(examen.getIdExamen());

                        surveillancesPlanifiees.add(surveillance);
                        surveillanceCount.put(surveillant.getId(), surveillanceCount.get(surveillant.getId()) + 1);
                        surveillanceParJour.get(surveillant.getId())
                                .computeIfAbsent(dateExamen, k -> new HashSet<>())
                                .add(demiJournee);
                        LOGGER.info("Surveillance planifiée: {}", surveillance);
                    }
                }
            }

            verifierEquiteDesServeillances(surveillanceCount);
            LOGGER.info("Vérification de l'équité des surveillances réussie.");

            //System.out.println(surveillancesPlanifiees.get(0));
            surveillanceRepository.saveAll(surveillancesPlanifiees);
            LOGGER.info("Surveillances enregistrées avec succès. Nombre total de surveillances planifiées: {}", surveillancesPlanifiees.size());
            return true;

        } catch (Exception e) {
            LOGGER.error("Erreur lors de la planification de la surveillance: {}", e.getMessage(), e);
            return false;
        }
    }

    private List<Enseignant> selectionnerReservistes(List<Enseignant> enseignants) {
        return enseignants.stream()
                .limit(NOMBRE_RESERVISTES)
                .collect(Collectors.toList());
    }

    private List<Enseignant> selectionnerSurveillants(
            List<Enseignant> enseignants,
            Map<Long, Integer> surveillanceCount,
            Map<Long, Map<LocalDate, Set<DemiJournee>>> surveillanceParJour,
            LocalDate date,
            DemiJournee demiJournee,
            int nombre,
            List<Enseignant> reservistes) {

        return enseignants.stream()
                .filter(e -> !reservistes.contains(e))
                .filter(e -> !estDejaOccupe(e.getId(), date, demiJournee, surveillanceParJour))
                .sorted(Comparator.comparingInt(e -> surveillanceCount.getOrDefault(e.getId(), 0)))
                .limit(nombre)
                .collect(Collectors.toList());
    }

    private boolean estDejaOccupe(
            Long enseignantId,
            LocalDate date,
            DemiJournee demiJournee,
            Map<Long, Map<LocalDate, Set<DemiJournee>>> surveillanceParJour) {

        return surveillanceParJour.get(enseignantId)
                .getOrDefault(date, new HashSet<>())
                .contains(demiJournee);
    }

    private DemiJournee determinerDemiJournee(LocalTime heure) {
        return heure.isBefore(LocalTime.of(12, 0)) ? DemiJournee.MATIN : DemiJournee.APRES_MIDI;
    }

    private void verifierEquiteDesServeillances(Map<Long, Integer> surveillanceCount) {
        int min = surveillanceCount.values().stream().mapToInt(Integer::intValue).min().orElse(0);
        int max = surveillanceCount.values().stream().mapToInt(Integer::intValue).max().orElse(0);

        if (max - min > 1) {
            throw new RuntimeException("La répartition des surveillances n'est pas équitable. " +
                    "Différence max entre enseignants: " + (max - min));
        }
    }

    public int calculerSurveillantsNecessaires(int nombreEtudiants) {
        if (nombreEtudiants >= 80 && nombreEtudiants <= 100) {
            return 4;
        } else if (nombreEtudiants >= 65 && nombreEtudiants < 80) {
            return 3;
        } else if (nombreEtudiants < 50) {
            return 2;
        }
        return 0;
    }

    private enum DemiJournee {
        MATIN,
        APRES_MIDI
    }
}