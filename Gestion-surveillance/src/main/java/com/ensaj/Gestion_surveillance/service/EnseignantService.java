package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Enseignant;

import java.util.List;
import java.util.Optional;

public interface EnseignantService {

    List<Enseignant> findEnseignantsByIdDept(Long departementId);
    

    List<Enseignant> getAllEnseignant();

    Enseignant saveEnseignant(Enseignant enseignant);

    // Trouver un enseignant par son ID
    Optional<Enseignant> findEnseignantById(Long id);

    // Supprimer un enseignant
    void deleteEnseignant(Long id);

    List<Enseignant> searchEnseignants(String search);

    public Long CountEnsaigant();

}