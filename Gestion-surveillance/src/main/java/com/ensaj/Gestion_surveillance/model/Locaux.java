package com.ensaj.Gestion_surveillance.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "locaux")

public class Locaux {

    public long getIdLocaux() {
		return idLocaux;
	}

	public void setIdLocaux(long idLocaux) {
		this.idLocaux = idLocaux;
	}

	public String getNomLocaux() {
		return nomLocaux;
	}

	public void setNomLocaux(String nomLocaux) {
		this.nomLocaux = nomLocaux;
	}

	public int getTaille() {
		return taille;
	}

	public void setTaille(int taille) {
		this.taille = taille;
	}

	public String getTypeLocaux() {
		return typeLocaux;
	}

	public void setTypeLocaux(String typeLocaux) {
		this.typeLocaux = typeLocaux;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idLocaux;

    @Column(name = "nomLocaux")
    private String nomLocaux;

    @Column(name = "taille")
    private int taille;

    @Column(name = "typeLocaux")
    private String typeLocaux;

}
