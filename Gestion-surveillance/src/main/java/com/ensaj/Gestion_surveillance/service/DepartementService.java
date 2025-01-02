package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Departement;

import java.util.List;
import java.util.Optional;

public interface DepartementService {

    List<Departement> getAllDepartements();

    Optional<Departement> getDepartementById(long idDept);

    void ajouterDepartement(Departement departement);

    void deleteDepartement(Long idDept);

    void updateDepartement(Long idDept, Departement departement);

    List<Departement> searchDepartements(String search);

    public Long CountDepartements();
}
