package com.ensaj.Gestion_surveillance.model;

import lombok.Data;

import jakarta.persistence.*;

import java.sql.Time;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Objects;

@Data
@Entity
@IdClass(SurveillanceId.class)
@Table(name = "Surveillance",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"date", "heureDebut", "heureFin", "idSurvei", "idReserviste"}),
                @UniqueConstraint(columnNames = {"idExamen", "idSurvei", "idReserviste"}),
                @UniqueConstraint(columnNames = {"date", "heureDebut", "heureFin", "idExamen"})
        }
)

public class Surveillance{

    @Id
    private Date date;
    @Id
    private Time heureDebut;
    @Id
    private Time heureFin;

    @Id
    @ManyToOne
    @JoinColumn(name = "idLocaux", nullable = false, foreignKey = @ForeignKey(name = "fk1"))
    private Locaux locaux;

    @Id
    @ManyToOne
    @JoinColumn(name = "idSurvei", nullable = false, foreignKey = @ForeignKey(name = "fk2"))
    private Enseignant surveillant;

    @Id
    @ManyToOne
    @JoinColumn(name = "idReserviste", nullable = false, foreignKey = @ForeignKey(name = "fk3"))
    private Enseignant reserviste;

    @Id
    @ManyToOne
    @JoinColumn(name = "idExamen", nullable = false, foreignKey = @ForeignKey(name = "fk4"))
    private Examen examen;

    public Locaux getLocaux() {
        return locaux;
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
        Surveillance that = (Surveillance) o;
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
    
    public boolean isValid() {
        return date != null && 
               heureDebut != null && 
               heureFin != null && 
               locaux != null && 
               (surveillant != null || reserviste != null) && 
               examen != null;
    }
}
