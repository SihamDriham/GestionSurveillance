package com.ensaj.Gestion_surveillance.repository;

import com.ensaj.Gestion_surveillance.model.Departement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartementRepository extends JpaRepository<Departement, Long> {

    @Query("SELECT d FROM Departement d WHERE " +
            "LOWER(CAST(d.idDept AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(d.nomDept) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Departement> searchDepartements(@Param("search") String search);

    Departement findByNomDept(String nomDept);

}
