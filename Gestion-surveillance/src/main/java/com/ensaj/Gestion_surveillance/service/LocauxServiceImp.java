package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Locaux;
import com.ensaj.Gestion_surveillance.repository.LocauxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class LocauxServiceImp implements LocauxService{

    @Autowired
    private LocauxRepository locauxRepository;


    @Override
    public List<Locaux> getAllLocaux() {
        return locauxRepository.findAll();
    }

    @Override
    public Optional<Locaux> getLocauxById(long idLocaux) {
        return locauxRepository.findById(idLocaux);
    }

    @Override
    public void ajouterLocaux(Locaux locaux) {
        locauxRepository.save(locaux);
    }

    @Override
    public void deleteLocaux(Long idLocaux) {
        if (locauxRepository.existsById(idLocaux)) {
            locauxRepository.deleteById(idLocaux);
        } else {
            throw new RuntimeException("Département avec l'ID " + idLocaux + " n'existe pas.");
        }
    }

    @Override
    public void updateLocaux(Long idLocaux, Locaux locaux) {
        Optional<Locaux> existingLocaux = locauxRepository.findById(idLocaux);
        if (existingLocaux.isPresent()) {
            Locaux l = existingLocaux.get();
            l.setNomLocaux(locaux.getNomLocaux());
            l.setTypeLocaux(locaux.getTypeLocaux());
            l.setTaille(locaux.getTaille());
            locauxRepository.save(l);
        }
    }

    @Override
    public List<Locaux> searchLocaux(String search) {
        if (search == null || search.trim().isEmpty()) {
            return locauxRepository.findAll();
        }

        return locauxRepository.searchLocaux(search);
    }


}
