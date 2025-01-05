package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Option;
import com.ensaj.Gestion_surveillance.repository.OptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OptionServiceImp implements OptionService {

    @Autowired
    private OptionRepository optionRepository;

   /* @Autowired
    private DepartementRepository departementRepository;

    @Override

    public List<Map<String, Object>> getAllOptionWithDetails() {
        List<Object[]> results = optionRepository.findAllOptionByDept();
        List<Map<String, Object>> options = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> optionData = new HashMap<>();
            optionData.put("nomOption", row[0]);
            optionData.put("nomdept", row[1]);
            optionData.put("idOption", row[2]);

            options.add(optionData);
        }

        return options;
    }


    @Override

    public void ajouterOption(Map<String, Object> requestBody, Long idDept) {
        Option option = new Option();

        Departement dept = departementRepository.findById(idDept)
                .orElseThrow(() -> new RuntimeException("Type avec id " + idDept + " non trouvé"));
        option.setDepartement(dept);

        optionRepository.save(option);
    }
*/

    @Override
    public List<Option> getAllOption() {
        return optionRepository.findAll();
    }

    @Override
    public Optional<Option> getOptionById(long idOption) {
        return optionRepository.findById(idOption);
    }

    @Override
    public void ajouterOption(Option option) {
        optionRepository.save(option);
    }

    @Override
    public void deleteOption(Long idOption) {
        if (optionRepository.existsById(idOption)) {
            optionRepository.deleteById(idOption);
        } else {
            throw new RuntimeException("Session avec l'ID " + idOption + " n'existe pas.");
        }
    }

    @Override
    public void updateOption(Long idOption, Option option) {
        Optional<Option> existingOption = optionRepository.findById(idOption);
        if (existingOption.isPresent()) {
            Option o = existingOption.get();
            o.setNomOption(option.getNomOption());
            optionRepository.save(o);
        }
    }

    @Override
    public List<Option> searchOption(String search) {
        if (search == null || search.trim().isEmpty()) {
            return optionRepository.findAll();
        }

        return optionRepository.searchOption(search);
    }

}
