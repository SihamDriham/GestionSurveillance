package com.ensaj.Gestion_surveillance.repository;

import com.ensaj.Gestion_surveillance.model.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {

    @Query("SELECT o FROM Option o WHERE " +
            "LOWER(CAST(o.idOption AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(CAST(o.nomOption AS string)) LIKE LOWER(CONCAT('%', :search, '%'))")

    List<Option> searchOption(@Param("search") String search);

    Option findByNomOption(String nomOption);

}
