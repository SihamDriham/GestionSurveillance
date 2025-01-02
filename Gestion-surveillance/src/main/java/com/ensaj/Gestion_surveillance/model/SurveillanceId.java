package com.ensaj.Gestion_surveillance.model;

import java.io.Serializable;
import java.sql.Time;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Objects;

import jakarta.persistence.Column;

public class SurveillanceId implements Serializable {

    private Date date;
    private Time heureDebut;
    private Time heureFin;
    private Locaux locaux;
    private Enseignant surveillant;
    private Enseignant reserviste;
    private Examen examen;

    public SurveillanceId() {}

    public SurveillanceId(Date date, Time heureDebut, Time heureFin, Locaux locaux, Enseignant surveillant, Enseignant reserviste, Examen examen) {
        this.date = date;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.locaux = locaux;
        this.surveillant = surveillant;
        this.reserviste = reserviste;
        this.examen = examen;
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

	public Locaux getLocaux() {
        return locaux;
    }

    public void setLocaux(Locaux locaux) {
        this.locaux = locaux;
    }

    public Enseignant getSurveillant() {
        return surveillant;
    }

    public void setSurveillant(Enseignant surveillant) {
        this.surveillant = surveillant;
    }

    public Enseignant getReserviste() {
        return reserviste;
    }

    public void setReserviste(Enseignant reserviste) {
        this.reserviste = reserviste;
    }

    public Examen getExamen() {
        return examen;
    }

    public void setExamen(Examen examen) {
        this.examen = examen;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SurveillanceId that = (SurveillanceId) o;
        return Objects.equals(date, that.date) &&
               Objects.equals(heureDebut, that.heureDebut) &&
               Objects.equals(heureFin, that.heureFin) &&
               Objects.equals(locaux, that.locaux) &&
               Objects.equals(surveillant, that.surveillant) &&
               Objects.equals(reserviste, that.reserviste) &&
               Objects.equals(examen, that.examen);
    }

    @Override
    public int hashCode() {
        return Objects.hash(date, heureDebut, heureFin, locaux, surveillant, reserviste, examen);
    }
    
}
