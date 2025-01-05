package com.ensaj.Gestion_surveillance.repository;

import com.ensaj.Gestion_surveillance.model.Surveillance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveillanceRepository extends JpaRepository<Surveillance, Long> {
}
