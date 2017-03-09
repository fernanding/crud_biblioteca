/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.iesvdc.acceso.entidades;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author faper-pc
 */
@Entity
@Table(name = "libro")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Libro.findAll", query = "SELECT l FROM Libro l")
    , @NamedQuery(name = "Libro.findById", query = "SELECT l FROM Libro l WHERE l.id = :id")
    , @NamedQuery(name = "Libro.findByNombre", query = "SELECT l FROM Libro l WHERE l.nombre = :nombre")
    , @NamedQuery(name = "Libro.findByCodigoISBN", query = "SELECT l FROM Libro l WHERE l.codigoISBN = :codigoISBN")
    , @NamedQuery(name = "Libro.findByAutor", query = "SELECT l FROM Libro l WHERE l.autor = :autor")
    , @NamedQuery(name = "Libro.findByFechaPrestamo", query = "SELECT l FROM Libro l WHERE l.fechaPrestamo = :fechaPrestamo")
    , @NamedQuery(name = "Libro.findByFechaDevolucion", query = "SELECT l FROM Libro l WHERE l.fechaDevolucion = :fechaDevolucion")})
public class Libro implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "nombre")
    private String nombre;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "codigoISBN")
    private String codigoISBN;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "autor")
    private String autor;
    @Column(name = "FechaPrestamo")
    @Temporal(TemporalType.DATE)
    private Date fechaPrestamo;
    @Column(name = "FechaDevolucion")
    @Temporal(TemporalType.DATE)
    private Date fechaDevolucion;
    @JoinColumn(name = "idCliente", referencedColumnName = "id")
    @ManyToOne
    private Cliente idCliente;

    public Libro() {
    }

    public Libro(Integer id) {
        this.id = id;
    }

    public Libro(Integer id, String nombre, String codigoISBN, String autor) {
        this.id = id;
        this.nombre = nombre;
        this.codigoISBN = codigoISBN;
        this.autor = autor;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigoISBN() {
        return codigoISBN;
    }

    public void setCodigoISBN(String codigoISBN) {
        this.codigoISBN = codigoISBN;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public Date getFechaPrestamo() {
        return fechaPrestamo;
    }

    public void setFechaPrestamo(Date fechaPrestamo) {
        this.fechaPrestamo = fechaPrestamo;
    }

    public Date getFechaDevolucion() {
        return fechaDevolucion;
    }

    public void setFechaDevolucion(Date fechaDevolucion) {
        this.fechaDevolucion = fechaDevolucion;
    }

    public Cliente getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Cliente idCliente) {
        this.idCliente = idCliente;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Libro)) {
            return false;
        }
        Libro other = (Libro) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.iesvdc.acceso.entidades.Libro[ id=" + id + " ]";
    }
    
}
