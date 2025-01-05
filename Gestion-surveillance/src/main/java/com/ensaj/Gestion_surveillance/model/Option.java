package com.ensaj.Gestion_surveillance.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "option")

public class Option {

    public long getIdOption() {
		return idOption;
	}

	public void setIdOption(long idOption) {
		this.idOption = idOption;
	}

	public String getNomOption() {
		return nomOption;
	}

	public void setNomOption(String nomOption) {
		this.nomOption = nomOption;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idOption;

    @Column(name = "nomOption")
    private String nomOption;

    /*@OneToMany(mappedBy = "option", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Examen> examens;

    @ManyToOne
    @JoinColumn(name = "idDept", nullable = false)
    private Departement departement;
    
    @OneToMany(mappedBy = "option", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Module> modules;*/

}
