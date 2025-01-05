package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Option;

import java.util.List;
import java.util.Optional;

public interface OptionService {

    /*List<Map<String, Object>> getAllOptionWithDetails();

    void ajouterOption(Map<String, Object> requestBody, Long idDept);*/

    List<Option> getAllOption();

    Optional<Option> getOptionById(long idOption);

    void ajouterOption(Option option);

    void updateOption(Long idOption, Option option);

    void deleteOption(Long idOption);

    List<Option> searchOption(String search);

}
