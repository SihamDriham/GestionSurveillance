package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Module;
import com.ensaj.Gestion_surveillance.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModuleServiceImp implements ModuleService {
    @Autowired
    private ModuleRepository moduleRepository;

    @Override
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    @Override
    public Module getModuleById(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + id));
    }

    @Override
    public Module createModule(Module module) {
        return moduleRepository.save(module);
    }

    @Override
    public Module updateModule(Long id, Module moduleDetails) {
        Module module = getModuleById(id);
        module.setNomModule(moduleDetails.getNomModule());
        module.setOption(moduleDetails.getOption());
        return moduleRepository.save(module);
    }

    @Override
    public void deleteModule(Long id) {
        Module module = getModuleById(id);
        moduleRepository.delete(module);
    }

    @Override
    public List<Module> findModuleByIdOption(Long idOption) {
        return moduleRepository.findModuleByIdOption(idOption);
    }
}