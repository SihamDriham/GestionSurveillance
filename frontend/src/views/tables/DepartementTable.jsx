import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Modal, Form, Button } from 'react-bootstrap';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { color } from 'd3';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const DepartementTable = () => {
    const [departementList, setDepartementList] = useState([]);
    const [filteredDepartementList, setFilteredDepartementList] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Ajout du state pour la recherche
    const [showModal, setShowModal] = useState(false);
    const [newDeptName, setNewDeptName] = useState("");
    const [editingDept, setEditingDept] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deptToDelete, setDeptToDelete] = useState(null);
    const [showError, setShowError] = useState(false); // Gestion de l'affichage de l'erreur

    const { idSession } = useParams();

    useEffect(() => {
        fetchDepartement();
    }, []);

    useEffect(() => {
        // Filtrer les départements en fonction de la recherche
        if (searchQuery === "") {
            setFilteredDepartementList(departementList);
        } else {
            const filtered = departementList.filter(departement =>
                departement.nomDept.toLowerCase().includes(searchQuery.toLowerCase()) ||
            departement.idDept.toString().includes(searchQuery)
            );
            setFilteredDepartementList(filtered);
        }
    }, [searchQuery, departementList]);

    const fetchDepartement = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get('http://localhost:3600/surveillance/api/departements/allDepartements', config);
            if (Array.isArray(response.data)) {
                setDepartementList(response.data);
                setFilteredDepartementList(response.data); // Initialiser le filtre avec la liste complète
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des départements :", error);
        }
    };

    

    const handleAddOrUpdateDept = async () => {
        if (newDeptName.trim() === "") {
            setShowError(true);  // Afficher le message d'erreur si le champ est vide
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            if (editingDept) {
                // Modification d'un département existant
                await axios.put(
                    `http://localhost:3600/surveillance/api/departements/update/${editingDept.idDept}`,
                    { nomDept: newDeptName },
                    config
                );
            } else {
                // Ajout d'un nouveau département
                await axios.post(
                    'http://localhost:3600/surveillance/api/departements/save',
                    { nomDept: newDeptName },
                    config
                );
            }

            setShowModal(false); // Fermer la modal
            setNewDeptName(""); // Réinitialiser le champ
            setEditingDept(null); // Réinitialiser l'état d'édition
            setShowError(false);  // Réinitialiser l'affichage de l'erreur
            fetchDepartement(); // Rafraîchir la liste
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'ajout ou de la modification du département :", error);
        }
    };

    const handleEdit = (idDept) => {
        const deptToEdit = departementList.find(dept => dept.idDept === idDept);
        setEditingDept(deptToEdit); // Mettre à jour l'état avec le département à modifier
        setNewDeptName(deptToEdit.nomDept); // Prendre le nom du département à modifier et l'afficher dans le champ
        setShowModal(true); // Afficher la modal
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.delete(
                `http://localhost:3600/surveillance/api/departements/delete/${deptToDelete}`,
                config
            );

            fetchDepartement();
            setShowConfirmModal(false);
            setDeptToDelete(null); // Réinitialiser le département à supprimer
        } catch (error) {
            console.error("Erreur lors de la suppression du département :", error);
        }
    };

    const confirmDelete = (idDept) => {
        setDeptToDelete(idDept);
        setShowConfirmModal(true);
    };

    const navigate = useNavigate();

    const handleEnseignant = (idDept) => {
        navigate(`/${idSession}/Enseignants/${idDept}`);
    };


    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Départements</Card.Title>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="d-block m-t-5">
                                    Gérer les départements
                                </span>
                                
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        backgroundColor: "#056cd4", // Couleur de fond
                                        borderColor: "#056cd4", // Couleur de la bordure
                                        color: "#ffffff" // Couleur du texte
                                    }}
                                    onClick={() => {
                                        setShowModal(true); // Afficher la modal pour ajouter un département
                                        setNewDeptName(""); // Réinitialiser le champ de texte
                                        setEditingDept(null); // Réinitialiser l'état d'édition
                                        setShowError(false);  // Réinitialiser l'affichage de l'erreur avant l'ajout
                                    }}
                                    >
                                    Ajouter une département
                                </button>
                                
                            </div>
                            <Form.Control
                                type="text"
                                placeholder="Rechercher une département"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ marginTop: '10px', width: '26%' ,borderRadius: '1'}}
                            />
                        </Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Département</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDepartementList.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                Aucun département trouvé.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDepartementList.map((departement, index) => (
                                            <tr key={departement.idDept}>
                                                <td>{index + 1}</td>
                                                <td>{departement.nomDept}</td>
                                                <td>
                                                
                                                    <>
                                                <FaEdit
                                                    size={24}
                                                    color="#056cd4"  // Appliquez la couleur #034d97 ici
                                                    onClick={() => handleEdit(departement.idDept)}
                                                    style={{ marginRight: '10px', cursor: 'pointer' }}
                                                    />
                                                    <FaRegTrashAlt
                                                        size={24}
                                                        color="red"
                                                        onClick={() => confirmDelete(departement.idDept)}
                                                        style={{ marginRight: '10px', cursor: 'pointer' }}
                                                    />
                                                    </>
                                                
                                                    <CgDetailsMore
                                                        size={24}
                                                        color="DarkSlateGray"
                                                        onClick={() => handleEnseignant(departement.idDept)}
                                                        style={{ marginRight: '10px', cursor: 'pointer' }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal pour Ajouter ou Modifier un département */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingDept ? "Modifier le Département" : "Ajouter un Département"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nom du département</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom du département"
                                value={newDeptName}
                                onChange={(e) => setNewDeptName(e.target.value)}
                                isInvalid={showError && newDeptName.trim() === ""}  // Affiche l'erreur uniquement après la soumission
                            />
                            <Form.Control.Feedback type="invalid">
                                Le nom du département est requis.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button style={{backgroundColor:'#056cd4'}} onClick={handleAddOrUpdateDept}>
                        {editingDept ? "Enregistrer les modifications" : "Ajouter"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmation de suppression */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer ce département ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default DepartementTable;
