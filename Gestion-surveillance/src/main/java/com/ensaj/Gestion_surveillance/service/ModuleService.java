package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Module;

import java.util.List;

public interface ModuleService {

    List<Module> findModuleByIdOption(Long idOption);

}
