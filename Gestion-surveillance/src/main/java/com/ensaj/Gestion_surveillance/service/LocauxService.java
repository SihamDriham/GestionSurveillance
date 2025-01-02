package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Locaux;

import java.util.List;
import java.util.Optional;

public interface LocauxService {

    List<Locaux> getAllLocaux();

    Optional<Locaux> getLocauxById(long idLocaux);

    void ajouterLocaux(Locaux locaux);

    void deleteLocaux(Long idLocaux);

    void updateLocaux(Long idLocaux, Locaux locaux);

    List<Locaux> searchLocaux(String search);


}
