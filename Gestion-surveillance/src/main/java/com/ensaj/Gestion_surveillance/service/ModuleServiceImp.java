package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Module;
import com.ensaj.Gestion_surveillance.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModuleServiceImp implements ModuleService{
    @Autowired
    private ModuleRepository moduleRepository;

    @Override
    public List<Module> findModuleByIdOption(Long idOption) {
        return moduleRepository.findModuleByIdOption(idOption);
    }


}
