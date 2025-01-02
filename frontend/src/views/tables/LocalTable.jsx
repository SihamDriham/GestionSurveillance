import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import axios from 'axios';

const LocalTable = () => {
    const [localList, setLocalList] = useState([]);
    const [filteredLocaux, setFilteredLocaux] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingLocal, setEditingLocal] = useState(null);
    const [localToDelete, setLocalToDelete] = useState(null);
    const [newLocal, setNewLocal] = useState({
        nomLocaux: '',
        taille: 0,
        typeLocaux: 'salle',
    });
    const [errors, setErrors] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    useEffect(() => {
        fetchLocaux();
    }, []);

    useEffect(() => {
        // Appliquer la recherche pour filtrer les locaux
        if (!searchQuery.trim()) {
            setFilteredLocaux(localList);
        } else {
            setFilteredLocaux(
                localList.filter(local =>
                    local.nomLocaux.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    local.typeLocaux.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    local.taille.toString().includes(searchQuery) || 
                    local.idLocaux.toString().includes(searchQuery)
                )
            );
        }
    }, [searchQuery, localList]);

    const fetchLocaux = async () => {
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
            
            const response = await axios.get('http://localhost:3600/surveillance/api/locaux/allLocaux', config);
            setLocalList(response.data || []);
            setFilteredLocaux(response.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des locaux :', error);
            alert('Erreur de chargement des données, veuillez réessayer plus tard.');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLocal({ ...newLocal, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateLocal = () => {
        const errorMessages = {};
        let isValid = true;

        if (!newLocal.nomLocaux.trim()) {
            errorMessages.nomLocaux = 'Le nom est requis.';
            isValid = false;
        }
        if (newLocal.taille <= 0) {
            errorMessages.taille = 'La taille doit être supérieure à zéro.';
            isValid = false;
        }
        if (!newLocal.typeLocaux.trim()) {
            errorMessages.typeLocaux = 'Le type est requis.';
            isValid = false;
        }

        setErrors(errorMessages);
        return isValid;
    };

    const handleSaveLocal = async () => {
        setFormSubmitted(true);
        if (!validateLocal()) return;

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
            if (editingLocal) {
                await axios.put(
                    `http://localhost:3600/surveillance/api/locaux/update/${editingLocal.idLocaux}`,
                    newLocal,
                    config
                );
            } else {
                await axios.post(
                    'http://localhost:3600/surveillance/api/locaux/save',
                    newLocal,
                    config
                );
            }
            fetchLocaux();
            resetForm();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
        }
    };

    const resetForm = () => {
        setShowModal(false);
        setEditingLocal(null);
        setNewLocal({ nomLocaux: '', taille: 0, typeLocaux: 'salle' });
        setFormSubmitted(false);
    };

    const confirmDelete = (id) => {
        setLocalToDelete(id);
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
                `http://localhost:3600/surveillance/api/locaux/delete/${localToDelete}`,
                config
            );

            fetchLocaux();
            setLocalToDelete(null);
        } catch (error) {
            console.error('Erreur lors de la suppression du local :', error);
        }
    };

    const openModal = (local = null) => {
        setEditingLocal(local);
        setNewLocal(local || { nomLocaux: '', taille: 0, typeLocaux: 'salle' });
        setLocalToDelete(null);
        setShowModal(true);
        setFormSubmitted(false);
    };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Locaux</Card.Title>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Gérer les locaux</span>
                                <Button style={{
                                        backgroundColor: "#056cd4", // Couleur de fond
                                        borderColor: "#056cd4", // Couleur de la bordure
                                        color: "#ffffff" // Couleur du texte
                                    }} variant="primary" onClick={() => openModal()}>
                                    Ajouter un local
                                </Button>
                            </div>
                            <Form.Control
                                type="text"
                                placeholder="Rechercher un local"
                                style={{ marginTop: '10px', width: '26%' ,borderRadius: '1'}}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="mt-3"
                            />
                        </Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nom</th>
                                        <th>Taille</th>
                                        <th>Type</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLocaux.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                Aucun local trouvé.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLocaux.map((local, index) => (
                                            <tr key={local.idLocaux}>
                                                <td>{index + 1}</td>
                                                <td>{local.nomLocaux}</td>
                                                <td>{local.taille}</td>
                                                <td>{local.typeLocaux}</td>
                                                <td>
                                                    <FaEdit
                                                        size={24}
                                                        color="#056cd4"
                                                        onClick={() => openModal(local)}
                                                        style={{ marginRight: '10px', cursor: 'pointer' }}
                                                    />
                                                    <FaRegTrashAlt
                                                        size={24}
                                                        color="red"
                                                        onClick={() => confirmDelete(local.idLocaux)}
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

            {/* Modal Ajouter / Modifier */}
            <Modal show={showModal} onHide={resetForm}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingLocal ? 'Modifier le local' : 'Ajouter un local'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                name="nomLocaux"
                                value={newLocal.nomLocaux}
                                onChange={handleChange}
                                isInvalid={formSubmitted && errors.nomLocaux}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nomLocaux}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Taille</Form.Label>
                            <Form.Control
                                type="number"
                                name="taille"
                                value={newLocal.taille}
                                onChange={handleChange}
                                isInvalid={formSubmitted && errors.taille}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.taille}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <div className="d-flex gap-3">
                                <Form.Check
                                    type="radio"
                                    label="Salle"
                                    name="typeLocaux"
                                    value="salle"
                                    checked={newLocal.typeLocaux === 'salle'}
                                    onChange={handleChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Amphi"
                                    name="typeLocaux"
                                    value="amphi"
                                    checked={newLocal.typeLocaux === 'amphi'}
                                    onChange={handleChange}
                                />
                             
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={resetForm}>
                        Annuler
                    </Button>
                    <Button style={{
                        backgroundColor: "#056cd4", // Couleur de fond
                        borderColor: "#056cd4", // Couleur de la bordure
                        color: "#ffffff" // Couleur du texte
                    }} onClick={handleSaveLocal}>
                        {editingLocal ? 'Modifier' : 'Ajouter'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Popup confirmation suppression */}
            <Modal show={!!localToDelete} onHide={() => setLocalToDelete(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Voulez-vous vraiment supprimer ce local ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setLocalToDelete(null)}>
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

export default LocalTable;
