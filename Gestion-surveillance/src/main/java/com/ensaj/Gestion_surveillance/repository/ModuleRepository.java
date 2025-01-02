package com.ensaj.Gestion_surveillance.repository;

import com.ensaj.Gestion_surveillance.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    Module findByNomModule(String nomModule);

    @Query("SELECT m FROM Module m WHERE m.option.idOption = :idOption")
    List<Module> findModuleByIdOption(Long idOption);
}
