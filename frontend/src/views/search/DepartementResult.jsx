import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import axios from 'axios';
import Search from '../search/SearchBarToggle'; // Barre de recherche
import 'bootstrap-icons/font/bootstrap-icons.css';

const BootstrapTable = () => {
  const [departements, setDepartements] = useState([]);
  const { projetId } = useParams();

  useEffect(() => {
    const searchResults = JSON.parse(localStorage.getItem('searchResults'));
    if (searchResults) {
      setDepartements(searchResults);
    } else {
      // Si aucun résultat de recherche n'est stocké, on récupère tous les départements
      fetchDepartements();
    }
  }, []);

  const fetchDepartements = async () => {
    try {
      const response = await axios.get('http://localhost:3600/surveillance/api/departements/allDepartements');
      setDepartements(response.data); // Chargement de tous les départements
    } catch (error) {
      console.error("Erreur lors de la récupération des départements :", error);
    }
  };

  const handleEdit = (departementId) => {
    window.location.href = `/forms/ModifierDepartement/${departementId}`;
  };

  const handleDelete = async (departementId) => {
    try {
      await axios.delete(`http://localhost:3600/surveillance/api/departements/${departementId}`);
      fetchDepartements(); // Recharger les départements après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du département :", error);
    }
  };

  const handleDetails = (departementId) => {
    window.location.href = `/tables/DetailsDepartement/${departementId}`;
  };

  return (
    <React.Fragment>
      <Search /> {/* Barre de recherche */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Liste des Départements</h5>
                <Link to={`/forms/ajouterDepartement/${projetId}`} className="btn btn-primary">Ajouter un département</Link>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nom</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departements.map((departement, index) => (
                    <tr key={departement.id}>
                      <td>{index + 1}</td>
                      <td>{departement.nomDept}</td>
                      <td>
                        <FaEdit size={24} color="DodgerBlue" onClick={() => handleEdit(departement.id)} style={{ marginRight: '10px', cursor: 'pointer' }} />
                        <FaRegTrashAlt size={24} color="red" onClick={() => handleDelete(departement.id)} style={{ marginRight: '10px', cursor: 'pointer' }} />
                        <CgDetailsMore size={24} color="DarkSlateGray" onClick={() => handleDetails(departement.id)} style={{ marginRight: '10px', cursor: 'pointer' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BootstrapTable;
