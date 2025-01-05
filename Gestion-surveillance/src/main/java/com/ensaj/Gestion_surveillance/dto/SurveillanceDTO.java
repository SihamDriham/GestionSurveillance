package com.ensaj.Gestion_surveillance.dto;

import java.sql.Time;
import java.util.Date;

public class SurveillanceDTO {
	private Date date;
	private Time heureDebut;
	private Time heureFin;
	private String locauxNom;
	private String surveillantNom;
	private String surveillantPrenom;
	private String reservisteNom;
	private String reservistePrenom;
	private String examenNom;

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
	public String getLocauxNom() {
		return locauxNom;
	}
	public void setLocauxNom(String locauxNom) {
		this.locauxNom = locauxNom;
	}
	public String getSurveillantNom() {
		return surveillantNom;
	}
	public void setSurveillantNom(String surveillantNom) {
		this.surveillantNom = surveillantNom;
	}
	public String getReservisteNom() {
		return reservisteNom;
	}
	public void setReservisteNom(String reservisteNom) {
		this.reservisteNom = reservisteNom;
	}
	public String getExamenNom() {
		return examenNom;
	}
	public void setExamenNom(String examenNom) {
		this.examenNom = examenNom;
	}


	public String getSurveillantPrenom() {
		return surveillantPrenom;
	}

	public void setSurveillantPrenom(String surveillantPrenom) {
		this.surveillantPrenom = surveillantPrenom;
	}

	public String getReservistePrenom() {
		return reservistePrenom;
	}

	public void setReservistePrenom(String reservistePrenom) {
		this.reservistePrenom = reservistePrenom;
	}
}