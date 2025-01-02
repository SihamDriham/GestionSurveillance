package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Enseignant;
import com.ensaj.Gestion_surveillance.repository.EnseignantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnseignantServiceImp implements EnseignantService{
    @Autowired
    private EnseignantRepository enseignantRepository;

    @Override
    public List<Enseignant> findEnseignantsByIdDept(Long departementId) {
        return enseignantRepository.findEnseignantsByIdDept(departementId);
    }
    
    @Override
    public List<Enseignant> getAllEnseignant() {
        return enseignantRepository.findAll();
    }

    @Override
    public Enseignant saveEnseignant(Enseignant enseignant) {
        return enseignantRepository.save(enseignant);
    }

    @Override
    public Optional<Enseignant> findEnseignantById(Long id) {
        return enseignantRepository.findById(id);
    }

    @Override
    public void deleteEnseignant(Long id) {
        enseignantRepository.deleteById(id);
    }

    @Override
    public List<Enseignant> searchEnseignants(String search) {
        if (search == null || search.trim().isEmpty()) {
            return enseignantRepository.findAll();
        }
        return enseignantRepository.searchEnseignants(search);
    }

    @Override
    public Long CountEnsaigant() {
        return enseignantRepository.count();
    }

}