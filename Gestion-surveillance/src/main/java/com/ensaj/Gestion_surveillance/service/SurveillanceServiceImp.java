/*package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.*;
import com.ensaj.Gestion_surveillance.repository.SurveillanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SurveillanceServiceImp {

    @Autowired
    private SurveillanceRepository surveillanceRepository;

    @Autowired
    private EnseignantService enseignantService;

    @Autowired
    private LocauxService locauxService;

    @Autowired
    private SessionService sessionService;
    
    public void planifierSurveillanceParDepartement(Long idSession) {
    	Optional<Session> sessionOpt = sessionService.getSessionById(idSession);
    	if (!sessionOpt.isPresent()) {
    	    throw new RuntimeException("Session not found.");
    	}
    	Session session = sessionOpt.get();
    	
    	if(session == null) System.out.println("Session is null");
    	else System.out.println("Session not null");
    	
    	List<Examen> examens = session.getExamens();
    	
    	if(examens == null) System.out.println("examens is null");
    	else System.out.println("examens not null");
    			
        // Récupérer la liste de tous les enseignants, y compris leurs départements
        List<Enseignant> enseignants = enseignantService.getAllEnseignant();
        if (enseignants.isEmpty()) throw new RuntimeException("Aucun enseignant disponible.");
        
        if(enseignants == null) System.out.println("enseignants is null");
        else System.out.println("enseignant not null");

        // Initialiser les compteurs pour les enseignants (séances surveillées et réservistes)
        Map<Enseignant, Integer> surveillanceCount = new HashMap<>();
        Map<Enseignant, Integer> reservisteCount = new HashMap<>();
        enseignants.forEach(e -> {
            surveillanceCount.put(e, 0);
            reservisteCount.put(e, 0);
        });

        // Regrouper les enseignants par département
        Map<Departement, List<Enseignant>> enseignantsParDepartement = enseignants.stream()
                .collect(Collectors.groupingBy(Enseignant::getDepartement));

        // Liste pour stocker les surveillances planifiées
        List<Surveillance> surveillancesPlanifiees = new ArrayList<>();

        // Boucler sur les examens pour attribuer surveillants et réservistes pour chaque local
        for (Examen examen : examens) {
            // Boucle sur chaque local de l'examen
            for (Locaux locaux : examen.getLocaux()) {
            	if(locaux == null) System.out.println("locaux is null");
                else System.out.println("locaux not null");
                int nombreEtudiants = locaux.getTaille();  // Taille du local (nombre d'étudiants dans le local)

                // Déterminer le nombre de surveillants nécessaires pour ce local
                int surveillantsNecessaires = calculerSurveillantsNecessaires(nombreEtudiants);

                // Boucle sur chaque département pour assigner les surveillants
                for (Departement departement : enseignantsParDepartement.keySet()) {
                	if(departement == null) System.out.println("departement is null");
                    else System.out.println("departement not null");
                    List<Enseignant> enseignantsDepartement = enseignantsParDepartement.get(departement);

                    // Sélectionner les surveillants pour ce local par département
                    List<Enseignant> surveillants = selectionnerSurveillantsParDepartement(enseignantsDepartement, surveillanceCount, surveillantsNecessaires);

                    // Sélectionner les réservistes pour ce local par département
                    List<Enseignant> reservistes = selectionnerReservistesParDepartement(enseignantsDepartement, reservisteCount);

                    // Ajouter les surveillances pour chaque surveillant
                    for (Enseignant surveillant : surveillants) {
                        Surveillance surveillance = new Surveillance();
                        if (surveillant != null && examen != null && locaux != null) {
	                        surveillance.setDate(examen.getDate());
	                        surveillance.setHeureDebut(examen.getHeureDebut());
	                        surveillance.setHeureFin(examen.getHeureFin());
	                        surveillance.setLocaux(locaux);  // Associer le local
	                        surveillance.setSurveillant(surveillant);
	                        surveillance.setExamen(examen);
	                        surveillancesPlanifiees.add(surveillance);
	                        surveillanceCount.put(surveillant, surveillanceCount.get(surveillant) + 1);
                        } else {
                            // Loggez une erreur si nécessaire ou lancez une exception
                        	System.out.println("Une entité requise est null lors de la planification de la surveillance.");
                        }
                    }
                    
                    System.out.println("date : " + examen.getDate());
                    System.out.println("heureDebut : " + examen.getHeureDebut());
                    System.out.println("heureFin : " + examen.getHeureFin());
                    

                    // Ajouter les surveillances pour chaque réserviste
                    for (Enseignant reserviste : reservistes) {
                    	if (reserviste != null && examen != null && locaux != null) {
	                        Surveillance surveillance = new Surveillance();
	                        surveillance.setDate(examen.getDate());
	                        surveillance.setHeureDebut(examen.getHeureDebut());
	                        surveillance.setHeureFin(examen.getHeureFin());
	                        surveillance.setLocaux(locaux);  // Associer le local
	                        surveillance.setReserviste(reserviste);
	                        surveillance.setExamen(examen);
	                        surveillancesPlanifiees.add(surveillance);
	                        reservisteCount.put(reserviste, reservisteCount.get(reserviste) + 1);  // Incrementer le compteur de réserviste
                    	} else {
                            // Loggez une erreur si nécessaire ou lancez une exception
                    		System.out.println("Une entité requise est null lors de la planification de la reserviste.");
                        }
                    }
                }
            }
        }

        // Sauvegarder les surveillances planifiées dans la base de données
        surveillanceRepository.saveAll(surveillancesPlanifiees);
    }
    
    
    

    private List<Enseignant> selectionnerSurveillantsParDepartement(List<Enseignant> enseignantsDepartement, Map<Enseignant, Integer> surveillanceCount, int nombre) {
        // Filtrer les enseignants qui ont moins de 2 séances surveillées
        return enseignantsDepartement.stream()
                .filter(e -> surveillanceCount.get(e) < 2) // Maximum de 2 demi-journées par jour
                .sorted(Comparator.comparingInt(surveillanceCount::get)) // Trier par nombre de séances attribuées
                .limit(nombre) // Limiter au nombre nécessaire
                .collect(Collectors.toList());
    }

    private List<Enseignant> selectionnerReservistesParDepartement(List<Enseignant> enseignantsDepartement, Map<Enseignant, Integer> reservisteCount) {
        // Trier les enseignants par le nombre de fois qu'ils ont été réservistes
        return enseignantsDepartement.stream()
                .filter(e -> reservisteCount.get(e) < 1) // Limiter à 1 fois par réserviste
                .sorted(Comparator.comparingInt(reservisteCount::get)) // Prioriser ceux qui ont été réservistes le moins souvent
                .limit(10) // Réserver 10 enseignants maximum par demi-journée
                .collect(Collectors.toList());
    }

        
        // Method to calculate the number of supervisors needed based on the local size (number of students)
        public int calculerSurveillantsNecessaires(int nombreEtudiants) {
            if (nombreEtudiants >= 80 && nombreEtudiants <= 100) {
                return 4;  // 4 supervisors for a local with 80-100 students
            } else if (nombreEtudiants >= 65 && nombreEtudiants < 80) {
                return 3;  // 3 supervisors for a local with 65-79 students
            } else if (nombreEtudiants < 50) {
                return 2;  // 2 supervisors for a local with less than 50 students
            }
            // If the number of students doesn't fall into any of the above categories, return 0 or a default value
            return 0;  // Default case, you can adjust this as needed
        }
    

    
}
*/

