package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Departement;
import com.ensaj.Gestion_surveillance.repository.DepartementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartementServiceImp implements DepartementService{

    @Autowired
    private DepartementRepository departementRepository;

    @Override
    public List<Departement> getAllDepartements() {
        return departementRepository.findAll();
    }

    @Override
    public Optional<Departement> getDepartementById(long idDept) {
        return departementRepository.findById(idDept);
    }

    @Override
    public void ajouterDepartement(Departement departement) {
        departementRepository.save(departement);
    }

    @Override
    public void updateDepartement(Long idDept, Departement departement) {
        Optional<Departement> existingDepartement = departementRepository.findById(idDept);
        if (existingDepartement.isPresent()) {
            Departement d = existingDepartement.get();
            d.setNomDept(departement.getNomDept());
            departementRepository.save(d);
        }
    }

    @Override
    public void deleteDepartement(Long idDept) {
        if (departementRepository.existsById(idDept)) {
            departementRepository.deleteById(idDept);
        } else {
            throw new RuntimeException("Département avec l'ID " + idDept + " n'existe pas.");
        }
    }




    @Override
    public List<Departement> searchDepartements(String search) {
        if (search == null || search.trim().isEmpty()) {
            return departementRepository.findAll();
        }

        return departementRepository.searchDepartements(search);
    }

    @Override
    public Long CountDepartements() {
        return departementRepository.count();
    }

}
