package com.ensaj.Gestion_surveillance.model;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "typeSession")

public class TypeSession {

    public long getIdTypeSession() {
		return idTypeSession;
	}

	public void setIdTypeSession(long idTypeSession) {
		this.idTypeSession = idTypeSession;
	}

	public String getNomType() {
		return nomType;
	}

	public void setNomType(String nomType) {
		this.nomType = nomType;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idTypeSession;

    @Column(name = "nomType")
    private String nomType;

   /* @OneToMany(mappedBy = "typeSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Session> sessions;*/

}
