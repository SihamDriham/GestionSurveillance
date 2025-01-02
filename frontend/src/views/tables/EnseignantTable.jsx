import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const EnseignantsTable = () => {
    const { idDept } = useParams(); // Récupère l'ID du département depuis l'URL
    const [enseignants, setEnseignants] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // État pour la recherche
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal de confirmation de suppression
    const [showEditModal, setShowEditModal] = useState(false); // Modal de modification
    const [enseignantToDelete, setEnseignantToDelete] = useState(null); // ID de l'enseignant à supprimer
    const [enseignantToEdit, setEnseignantToEdit] = useState(null); // Données de l'enseignant à modifier
    const [newEnseignant, setNewEnseignant] = useState({
        nom: '',
        prenom: '',
        email: '',
        disponse: false,
    });

    // Erreurs de validation
    const [errors, setErrors] = useState({
        nom: '',
        prenom: '',
        email: '',
    });

    useEffect(() => {
        fetchEnseignants();
    }, [idDept]);

    const fetchEnseignants = async () => {
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

            const response = await axios.get(`http://localhost:3600/surveillance/api/enseignants/allEnsegnant/${idDept}`, config);
            setEnseignants(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des enseignants :", error);
        }
    };

    const handleDelete = async () => {
        try {
            if (enseignantToDelete) {
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

                // Suppression de l'enseignant
                await axios.delete(`http://localhost:3600/surveillance/api/enseignants/delete/${enseignantToDelete}`, config);
                fetchEnseignants(); // Recharge la liste après suppression
                setShowConfirmModal(false); // Ferme le modal de confirmation
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'enseignant :", error);
        }
    };

    const confirmDelete = (id) => {
        setEnseignantToDelete(id); // Définit l'ID de l'enseignant à supprimer
        setShowConfirmModal(true); // Affiche le modal de confirmation
    };

    const handleShowModal = () => {
        setNewEnseignant({
            nom: '',
            prenom: '',
            email: '',
            disponse: false,
        });
        setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);

    const handleEditModal = (enseignant) => {
        setEnseignantToEdit(enseignant); // Définit l'enseignant à modifier
        setShowEditModal(true); // Affiche le modal d'édition
    };

    const handleCloseEditModal = () => {
        setEnseignantToEdit(null);
        setShowEditModal(false);
    };



    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewEnseignant({
            ...newEnseignant,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    //--------------------------
    const validateFields = () => {
        let isValid = true;
        let errors = {};

        if (!newEnseignant.nom.trim()) {
            errors.nom = "Le nom est requis";
            isValid = false;
        }

        if (!newEnseignant.prenom.trim()) {
            errors.prenom = "Le prénom est requis";
            isValid = false;
        }

        // Validation de l'email avec une expression régulière
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!newEnseignant.email.trim()) {
            errors.email = "L'email est requis";
            isValid = false;
        } else if (!emailPattern.test(newEnseignant.email)) {
            errors.email = "L'email n'est pas valide";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };
    //--------------------------

    const handleAddEnseignant = async () => {
        if (!validateFields()) return;
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

            const enseignantData = {
                ...newEnseignant,
                departement: { idDept: idDept }, // Utilisation de idDept pour correspondre à la structure attendue
            };

            const response = await axios.post('http://localhost:3600/surveillance/api/enseignants/add', enseignantData, config);

            if (response.status === 201) {
                fetchEnseignants(); // Recharge la liste
                handleCloseModal(); // Ferme la modale après ajout
            } else {
                console.error("Erreur lors de l'ajout de l'enseignant :", response);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'enseignant :", error);
        }
    };

    const handleEditEnseignant = async () => {
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

            const enseignantData = {
                ...enseignantToEdit,
                departement: { idDept: idDept }, // Utilisation de idDept pour correspondre à la structure attendue
            };

            const response = await axios.put(`http://localhost:3600/surveillance/api/enseignants/update/${enseignantToEdit.id}`, enseignantData, config);

            if (response.status === 200) {
                fetchEnseignants(); // Recharge la liste après modification
                handleCloseEditModal(); // Ferme le modal après modification
            } else {
                console.error("Erreur lors de la modification de l'enseignant :", response);
            }
        } catch (error) {
            console.error("Erreur lors de la modification de l'enseignant :", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Met à jour la valeur de recherche
    };

    // Filtrage des enseignants en fonction de la recherche
    const filteredEnseignants = enseignants.filter(enseignant => 
        enseignant.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enseignant.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enseignant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enseignant.id.toString().includes(searchQuery)  // Recherche sur l'id                )

    );

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Département {idDept} - Enseignants</Card.Title>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Gérer les enseignants</span>
                                <Button style={{
                                        backgroundColor: "#056cd4", 
                                        borderColor: "#056cd4", 
                                        color: "#ffffff"
                                    }}onClick={handleShowModal}>
                                    Ajouter un enseignant
                                </Button>
                            </div>
                            {/* Search input */}
                            <Form.Control
                                type="text"
                                placeholder="Rechercher un enseignant"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                style={{ marginTop: '10px', width: '26%' ,borderRadius: '1'}}
                                className="mt-3"
                            />
                        </Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>Email</th>
                                        <th>Dispensé</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEnseignants.length > 0 ? (
                                        filteredEnseignants.map((enseignant, index) => (
                                            <tr key={enseignant.id}>
                                                <td>{index + 1}</td>
                                                <td>{enseignant.nom}</td>
                                                <td>{enseignant.prenom}</td>
                                                <td>{enseignant.email}</td>
                                                <td>{enseignant.disponse ? '✔' : '✘'}</td>
                                                <td>
                                                    <FaEdit
                                                        size={24}
                                                        color="DodgerBlue"
                                                        style={{ cursor: 'pointer', marginRight: '10px' ,color: '#056cd4'}}
                                                        onClick={() => handleEditModal(enseignant)} // Ouvre le modal d'édition
                                                    />
                                                    <FaRegTrashAlt
                                                        size={24}
                                                        color="red"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => confirmDelete(enseignant.id)} // Ouvre le modal de suppression
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">Aucun enseignant trouvé.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal pour ajouter un enseignant */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un enseignant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNom">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom"
                                name="nom"
                                value={newEnseignant.nom}
                                onChange={handleInputChange}
                                isInvalid={!!errors.nom}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nom}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPrenom">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le prénom"
                                name="prenom"
                                value={newEnseignant.prenom}
                                onChange={handleInputChange}
                                isInvalid={!!errors.prenom}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.prenom}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Entrez l'email"
                                name="email"
                                value={newEnseignant.email}
                                onChange={handleInputChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formDisponse">
                            <Form.Check
                                type="checkbox"
                                label="Dispense des cours"
                                name="disponse"
                                checked={newEnseignant.disponse}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                    <Button style={{backgroundColor:'#056cd4'}} variant="primary" onClick={handleAddEnseignant}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmation de suppression */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Êtes-vous sûr de vouloir supprimer cet enseignant ?</p>
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

            {/* Modal d'édition de l'enseignant */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier l'enseignant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNom">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom"
                                name="nom"
                                value={enseignantToEdit?.nom || ''}
                                onChange={e => setEnseignantToEdit({...enseignantToEdit, nom: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPrenom">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le prénom"
                                name="prenom"
                                value={enseignantToEdit?.prenom || ''}
                                onChange={e => setEnseignantToEdit({...enseignantToEdit, prenom: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Entrez l'email"
                                name="email"
                                value={enseignantToEdit?.email || ''}
                                onChange={e => setEnseignantToEdit({...enseignantToEdit, email: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDisponse">
                            <Form.Check
                                type="checkbox"
                                label="Dispense des cours"
                                name="disponse"
                                checked={enseignantToEdit?.disponse || false}
                                onChange={e => setEnseignantToEdit({...enseignantToEdit, disponse: e.target.checked})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Fermer
                    </Button>
                    <Button style={{backgroundColor:'#056cd4'}} variant="primary" onClick={handleEditEnseignant}>
                        Modifier
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default EnseignantsTable;
