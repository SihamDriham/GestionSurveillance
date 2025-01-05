package com.ensaj.Gestion_surveillance.repository;

import com.ensaj.Gestion_surveillance.model.Examen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.util.Date;
import java.util.List;

@Repository
public interface ExamenRepository extends JpaRepository<Examen, Long> {

    @Query("SELECT s.idSession, e.date, e.heureDebut, e.heureFin, e.nbEtudiant, " +
            "en.nom, en.prenom, o.nomModule " +
            "FROM Examen e " +
            "JOIN e.session s " +
            "JOIN e.enseignant en "+
            "JOIN e.module o ")
    List<Object[]> findAllExamens();

    @Query("SELECT s.idSession, e.date, e.heureDebut, e.heureFin, " +
            "en.nom, en.prenom, o.nomModule " +
            "FROM Examen e " +
            "JOIN e.session s " +
            "JOIN e.enseignant en "+
            "JOIN e.module o "+
            "WHERE e.session.idSession = :idSession AND e.date = :date AND e.heureDebut = :heureDebut AND e.heureFin = :heureFin")
    List<Object[]> findExamensWithdetails(@Param("idSession") Long idSession,
                                          @Param("date") Date date,
                                          @Param("heureDebut") Time heureDebut,
                                          @Param("heureFin") Time heureFin);

    @Query("SELECT e FROM Examen e WHERE e.session.idSession = :idSession AND e.date = :date AND e.heureDebut = :heureDebut AND e.heureFin = :heureFin")
    List<Examen> findExamensByIdSessionDateHeureDebutHeureFin(@Param("idSession") Long idSession,
                                                              @Param("date") Date date,
                                                              @Param("heureDebut") Time heureDebut,
                                                              @Param("heureFin") Time heureFin);
    
    @Query("SELECT e FROM Examen e WHERE e.session.id = :sessionId")
    List<Examen> findBySessionId(Long sessionId);

}
