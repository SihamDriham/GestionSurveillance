package com.ensaj.Gestion_surveillance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Time;
import java.util.Date;
import java.util.Objects;

@Data
@Entity
@Table(name = "surveillance")
public class Surveillance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Date date;

    @Column(nullable = false)
    private Time heureDebut;


    @Column(nullable = false)
    private Time heureFin;

    @Column(name = "idLocaux", nullable = false)
    private Long idLocaux;

    @Column(name = "idSurveillant", nullable = false)
    private Long idSurveillant;

    @Column(name = "idReserviste", nullable = true) // Facultatif
    private Long idReserviste;

    @Column(name = "idExamen", nullable = false)
    private Long idExamen;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Surveillance that = (Surveillance) o;
        return Objects.equals(date, that.date) &&
                Objects.equals(heureDebut, that.heureDebut) &&
                Objects.equals(heureFin, that.heureFin) &&
                Objects.equals(idLocaux, that.idLocaux) &&
                Objects.equals(idSurveillant, that.idSurveillant) &&
                Objects.equals(idReserviste, that.idReserviste) &&
                Objects.equals(idExamen, that.idExamen);
    }

    @Override
    public int hashCode() {
        return Objects.hash(date, heureDebut, heureFin, idLocaux, idSurveillant, idReserviste, idExamen);
    }
}