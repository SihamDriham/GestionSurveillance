package com.ensaj.Gestion_surveillance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "departement")

public class Departement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idDept;

    @Column(name = "nomDept")
    private String nomDept;

    @OneToMany(mappedBy = "departement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Enseignant> enseignants;

	public long getIdDept() {
		return idDept;
	}

	public void setIdDept(long idDept) {
		this.idDept = idDept;
	}

	public String getNomDept() {
		return nomDept;
	}

	public void setNomDept(String nomDept) {
		this.nomDept = nomDept;
	}

	public List<Enseignant> getEnseignants() {
		return enseignants;
	}

	public void setEnseignants(List<Enseignant> enseignants) {
		this.enseignants = enseignants;
	}

   /* @OneToMany(mappedBy = "departement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Option> options;
*/

}
