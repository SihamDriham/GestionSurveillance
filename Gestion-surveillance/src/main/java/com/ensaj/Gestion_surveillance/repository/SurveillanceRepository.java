package com.ensaj.Gestion_surveillance.repository;

import com.ensaj.Gestion_surveillance.model.Enseignant;
import com.ensaj.Gestion_surveillance.model.Surveillance;
import com.ensaj.Gestion_surveillance.model.SurveillanceId;

import java.sql.Time;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveillanceRepository extends JpaRepository<Surveillance, SurveillanceId> {

    @Query("SELECT COUNT(s) FROM Surveillance s WHERE s.surveillant.id = :surveillantId AND s.date = :date AND s.heureDebut = :heureDebut AND s.heureFin = :heureFin")
    long countBySurveillantAndDate(Long surveillantId, Date date, Time heureDebut, Time heureFin);

    @Query("SELECT s FROM Surveillance s WHERE s.date = :date AND s.heureDebut = :heureDebut AND s.heureFin = :heureFin AND s.locaux.idLocaux = :locauxId")
    List<Surveillance> findByDateAndLocaux(Date date, Time heureDebut, Time heureFin, Long locauxId);
    
	
	long countByDateAndSurveillant(Date date, Enseignant surveillant);
}

