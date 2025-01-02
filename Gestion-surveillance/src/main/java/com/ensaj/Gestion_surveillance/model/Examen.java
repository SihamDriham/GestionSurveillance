package com.ensaj.Gestion_surveillance.model;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.sql.Time;

@Data
@Entity
@Table(name = "examen")
public class Examen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idExamen;

    @Column(name = "nbEtudiant")
    private Integer nbEtudiant;

    public long getIdExamen() {
		return idExamen;
	}

	public void setIdExamen(long idExamen) {
		this.idExamen = idExamen;
	}

	public Integer getNbEtudiant() {
		return nbEtudiant;
	}

	public void setNbEtudiant(Integer nbEtudiant) {
		this.nbEtudiant = nbEtudiant;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Time getHeureDebut() {
		return heureDebut;
	}

	public void setHeureDebut(Time heureDebut) {
		this.heureDebut = heureDebut;
	}

	public Time getHeureFin() {
		return heureFin;
	}

	public void setHeureFin(Time heureFin) {
		this.heureFin = heureFin;
	}

	public Module getModule() {
		return module;
	}

	public void setModule(Module module) {
		this.module = module;
	}

	public Session getSession() {
		return session;
	}

	public void setSession(Session session) {
		this.session = session;
	}

	public Enseignant getEnseignant() {
		return enseignant;
	}

	public void setEnseignant(Enseignant enseignant) {
		this.enseignant = enseignant;
	}

	@Column(name = "date")
    private Date date;

    @Column(name = "heureDebut")
    private Time heureDebut;

    @Column(name = "heureFin")
    private Time heureFin;

    @ManyToOne
    @JoinColumn(name = "idModule")
    private Module module;

    @ManyToOne
    @JoinColumn(name = "idSession")
    private Session session;

    @ManyToOne
    @JoinColumn(name = "idEnseignant")
    private Enseignant enseignant;
    
    
    @ManyToMany
    @JoinTable(
        name = "examen_locaux", 
        joinColumns = @JoinColumn(name = "idExamen"), 
        inverseJoinColumns = @JoinColumn(name = "idLocaux")
    )
    List<Locaux> locaux = new ArrayList<>();
    
	public List<Locaux> getLocaux() {
		return locaux;
	}

	public void setLocaux(List<Locaux> locaux) {
		this.locaux = locaux;
	}

    
}
