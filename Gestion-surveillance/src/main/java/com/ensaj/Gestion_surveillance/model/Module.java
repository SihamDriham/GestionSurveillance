package com.ensaj.Gestion_surveillance.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "module")

public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idModule;

    @Column(name = "nomModule")
    private String nomModule;

    public long getIdModule() {
		return idModule;
	}

	public void setIdModule(long idModule) {
		this.idModule = idModule;
	}

	public String getNomModule() {
		return nomModule;
	}

	public void setNomModule(String nomModule) {
		this.nomModule = nomModule;
	}

	public Option getOption() {
		return option;
	}

	public void setOption(Option option) {
		this.option = option;
	}

	@ManyToOne
    @JoinColumn(name = "idOption")
    private Option option;

}
