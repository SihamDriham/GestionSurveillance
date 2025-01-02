package com.ensaj.Gestion_surveillance.repository;

import com.ensaj.Gestion_surveillance.model.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {

    @Query("SELECT e FROM Enseignant e WHERE e.departement.idDept = :idDept")
    List<Enseignant> findEnseignantsByIdDept(Long idDept);

    @Query("SELECT e FROM Enseignant e WHERE " +
            "LOWER(CAST(e.id AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.prenom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))")

    List<Enseignant> searchEnseignants(@Param("search") String search);

    Enseignant findByEmail(String email);
}