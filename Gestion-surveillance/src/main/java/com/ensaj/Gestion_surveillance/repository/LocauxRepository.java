package com.ensaj.Gestion_surveillance.repository;

import com.ensaj.Gestion_surveillance.model.Locaux;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocauxRepository extends JpaRepository<Locaux, Long> {

    @Query("SELECT l FROM Locaux l WHERE " +
            "LOWER(CAST(l.idLocaux AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(l.nomLocaux) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(CAST(l.taille AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(l.typeLocaux) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Locaux> searchLocaux(@Param("search") String search);

    Locaux findByNomLocaux(String nomLocaux);
}
