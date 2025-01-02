package com.ensaj.Gestion_surveillance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Time;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "session")

public class Session {

    public long getIdSession() {
		return idSession;
	}

	public void setIdSession(long idSession) {
		this.idSession = idSession;
	}

	public Date getDateDebut() {
		return dateDebut;
	}

	public void setDateDebut(Date dateDebut) {
		this.dateDebut = dateDebut;
	}

	public Date getDateFin() {
		return dateFin;
	}

	public void setDateFin(Date dateFin) {
		this.dateFin = dateFin;
	}

	public Time getHeureDebut1() {
		return heureDebut1;
	}

	public void setHeureDebut1(Time heureDebut1) {
		this.heureDebut1 = heureDebut1;
	}

	public Time getHeureFin1() {
		return heureFin1;
	}

	public void setHeureFin1(Time heureFin1) {
		this.heureFin1 = heureFin1;
	}

	public Time getHeureDebut2() {
		return heureDebut2;
	}

	public void setHeureDebut2(Time heureDebut2) {
		this.heureDebut2 = heureDebut2;
	}

	public Time getHeureFin2() {
		return heureFin2;
	}

	public void setHeureFin2(Time heureFin2) {
		this.heureFin2 = heureFin2;
	}

	public Time getHeureDebut3() {
		return heureDebut3;
	}

	public void setHeureDebut3(Time heureDebut3) {
		this.heureDebut3 = heureDebut3;
	}

	public Time getHeureFin3() {
		return heureFin3;
	}

	public void setHeureFin3(Time heureFin3) {
		this.heureFin3 = heureFin3;
	}

	public Time getHeureDebut4() {
		return heureDebut4;
	}

	public void setHeureDebut4(Time heureDebut4) {
		this.heureDebut4 = heureDebut4;
	}

	public Time getHeureFin4() {
		return heureFin4;
	}

	public void setHeureFin4(Time heureFin4) {
		this.heureFin4 = heureFin4;
	}

	public boolean isValider() {
		return valider;
	}

	public void setValider(boolean valider) {
		this.valider = valider;
	}

	public TypeSession getTypeSession() {
		return typeSession;
	}

	public void setTypeSession(TypeSession typeSession) {
		this.typeSession = typeSession;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idSession;

    @Column(name = "dateDebut")
    private Date dateDebut;

    @Column(name = "dateFin")
    private Date dateFin;


    @Column(name = "heureDebut1")
    private Time heureDebut1;

    @Column(name = "heureFin1")
    private Time heureFin1;

    @Column(name = "heureDebut2")
    private Time heureDebut2;

    @Column(name = "heureFin2")
    private Time heureFin2;

    @Column(name = "heureDebut3")
    private Time heureDebut3;

    @Column(name = "heureFin3")
    private Time heureFin3;

    @Column(name = "heureDebut4")
    private Time heureDebut4;

    @Column(name = "heureFin4")
    private Time heureFin4;

    @Column(name = "valider", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean valider;

    @ManyToOne
    @JoinColumn(name = "idTypeSession")
    private TypeSession typeSession;

    @JsonIgnore
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Examen> examens;

	public List<Examen> getExamens() {
		return examens;
	}

	public void setExamens(List<Examen> examens) {
		this.examens = examens;
	}


}
