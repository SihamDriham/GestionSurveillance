package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.TypeSession;
import com.ensaj.Gestion_surveillance.repository.TypeSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TypeServiceImp implements TypeService{

    @Autowired
    private TypeSessionRepository typeSessionRepository;

    @Override
    public List<TypeSession> getAllType() {
        return typeSessionRepository.findAll();
    }

}
