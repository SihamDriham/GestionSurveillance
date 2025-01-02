package com.ensaj.Gestion_surveillance.repository;

import com.ensaj.Gestion_surveillance.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("SELECT t.nomType, s.dateDebut, s.dateFin, s.heureDebut1, s.heureFin1, " +
            "s.heureDebut2, s.heureFin2, s.heureDebut3, s.heureFin3, s.heureDebut4, s.heureFin4, s.idSession, s.valider " +
            "FROM Session s " +
            "JOIN s.typeSession t")

    List<Object[]> findAllSessionsByType();

    @Query("SELECT s FROM Session s WHERE " +
            "LOWER(CAST(s.idSession AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(CAST(s.dateDebut AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(CAST(s.dateFin AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(CAST(s.heureDebut1 AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(CAST(s.heureFin1 AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(CAST(s.heureDebut2 AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(CAST(s.heureFin2 AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(s.typeSession.nomType) LIKE LOWER(CONCAT('%', :search, '%'))")

    List<Session> searchSessions(@Param("search") String search);

}
