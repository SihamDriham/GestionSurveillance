package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Module;

import java.util.List;

public interface ModuleService {
    List<Module> getAllModules();
    Module getModuleById(Long id);
    Module createModule(Module module);
    Module updateModule(Long id, Module moduleDetails);
    void deleteModule(Long id);
    List<Module> findModuleByIdOption(Long idOption);
}
