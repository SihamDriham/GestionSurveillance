package com.ensaj.Gestion_surveillance.service;

import com.ensaj.Gestion_surveillance.model.Departement;
import com.ensaj.Gestion_surveillance.model.Enseignant;
import com.ensaj.Gestion_surveillance.model.Locaux;
import com.ensaj.Gestion_surveillance.model.Option;
import com.ensaj.Gestion_surveillance.model.Module;
import com.ensaj.Gestion_surveillance.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ExcelService {

    @Autowired
    private EnseignantRepository enseignantRepository;
    @Autowired
    private DepartementRepository departementRepository;
    @Autowired
    private LocauxRepository locauxRepository;
    @Autowired
    private ModuleRepository moduleRepository;
    @Autowired
    private OptionRepository optionRepository;

    public void importDataFromExcel(MultipartFile file) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // On prend la première feuille du fichier Excel

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // On saute la ligne d'en-tête

                // Lecture des données depuis chaque colonne
                String nomDepartement = row.getCell(0).getStringCellValue().trim();
                String nomEnseignant = row.getCell(1).getStringCellValue().trim();
                String prenomEnseignant = row.getCell(2).getStringCellValue().trim();
                String emailEnseignant = row.getCell(3).getStringCellValue().trim();
//                Boolean disponse = row.getCell(4).getBooleanCellValue();
                String disponse = row.getCell(4).getStringCellValue().trim();
                String nomLocaux = row.getCell(5).getStringCellValue().trim();
                String typeLocaux = row.getCell(6).getStringCellValue().trim();
                int tailleLocaux = getIntCellValue(row.getCell(7)); // Correction ici
                String nomOption = row.getCell(8).getStringCellValue().trim();
                String nomModule = row.getCell(9).getStringCellValue().trim();

                // Vérifier et insérer le département
                Departement departement = departementRepository.findByNomDept(nomDepartement);
                if (departement == null) {
                    departement = new Departement();
                    departement.setNomDept(nomDepartement);
                    departementRepository.save(departement);
                }

                // Vérifier et insérer l'enseignant
                Enseignant enseignant = enseignantRepository.findByEmail(emailEnseignant);
                System.out.println("Le nom de l'enseignant : " + nomEnseignant);
                if (enseignant == null) {
                    enseignant = new Enseignant();
                    enseignant.setNom(nomEnseignant);
                    enseignant.setPrenom(prenomEnseignant);
                    enseignant.setEmail(emailEnseignant);
                    if (disponse.equals("non")){
                        enseignant.setDisponse(false);
                    }
                    enseignant.setDisponse(true);
                    enseignant.setDepartement(departement); // Lien avec le département
                    enseignantRepository.save(enseignant);
                }

                // Vérifier et insérer le local
                Locaux locaux = locauxRepository.findByNomLocaux(nomLocaux);
                if (locaux == null) {
                    locaux = new Locaux();
                    locaux.setNomLocaux(nomLocaux);
                    locaux.setTaille(tailleLocaux);
                    locaux.setTypeLocaux(typeLocaux);
                    locauxRepository.save(locaux);
                }

                // Vérifier et insérer l'option (si elle existe dans le domaine métier)
                Option option = optionRepository.findByNomOption(nomOption); // Exemple de méthode pour trouver une option
                if (option == null) {
                    option = new Option();
                    option.setNomOption(nomOption);
                    optionRepository.save(option);
                }

                // Vérifier et insérer le module
                Module module = moduleRepository.findByNomModule(nomModule);
                if (module == null) {
                    module = new Module();
                    module.setNomModule(nomModule);
                    module.setOption(option);
                    moduleRepository.save(module);
                }
            }
        }
    }

    private int getIntCellValue(Cell cell) {
        if (cell != null && cell.getCellType() == CellType.NUMERIC) {
            return (int) cell.getNumericCellValue();
        } else if (cell != null && cell.getCellType() == CellType.STRING) {
            try {
                return Integer.parseInt(cell.getStringCellValue().trim());
            } catch (NumberFormatException e) {
                return 0; // ou une valeur par défaut si le format n'est pas valide
            }
        }
        return 0; // Valeur par défaut si la cellule est vide ou mal formatée
    }
}

