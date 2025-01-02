import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const ModuleTable = () => {
    const { idOption } = useParams(); // Récupère l'ID du département depuis l'URL
    const [modules, setModules] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal de confirmation de suppression
    const [showEditModal, setShowEditModal] = useState(false); // Modal de modification
    const [moduleToDelete, setModuleToDelete] = useState(null); // ID de l'enseignant à supprimer
    const [moduleToEdit, setModuleToEdit] = useState(null); // Données de l'enseignant à modifier
    const [newModuleName, setNewModuleName] = useState("");

    // Erreurs de validation
    const [errors, setErrors] = useState({
     nomModule: ''
    });

    useEffect(() => {
        fetchModules();
    }, [idOption]);

    const fetchModules = async () => {
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

            const response = await axios.get(`http://localhost:3600/surveillance/api/module/allModule/${idOption}`, config);
            setModules(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des enseignants :", error);
        }
    };

    const handleDelete = async () => {
        try {
            if (moduleToDelete) {
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
                await axios.delete(`http://localhost:3600/surveillance/api/module/${moduleToDelete}`, config);
                fetchModules(); // Recharge la liste après suppression
                setShowConfirmModal(false); // Ferme le modal de confirmation
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'enseignant :", error);
        }
    };

    const confirmDelete = (id) => {
        setModuleToDelete(id); // Définit l'ID de l'enseignant à supprimer
        setShowConfirmModal(true); // Affiche le modal de confirmation
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleEditModal = (module) => {
        setModuleToEdit(module);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setModuleToEdit(null);
        setShowEditModal(false);
    };

    //--------------------------
    const validateFields = () => {
        const errors = {};
        let isValid = true;

        if (!newModuleName.trim()) {
            errors.nomModule = "Le nom du module est requis";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };
    //--------------------------

    const handleAddModule = async () => {
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

            const moduleData = {
                nomModule: newModuleName,
                option: { idOption: idOption },
            };            

            const response = await axios.post('http://localhost:3600/surveillance/api/module', moduleData, config);

            if (response.status === 200) {
                fetchModules(); // Recharge la liste
                handleCloseModal(); // Ferme la modale après ajout
            } else {
                console.error("Erreur lors de l'ajout du module :", response);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du module :", error);
        }
    };

    const handleEditModule = async () => {
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

            const moduleData = {
                ...moduleToEdit,
                option: { idOption: idOption }, 
            };
            console.log("ID du module à modifier :", moduleToEdit.idModule);
            const response = await axios.put(`http://localhost:3600/surveillance/api/module/${moduleToEdit.idModule}`, moduleData, config);

            if (response.status === 200) {
                fetchModules(); // Recharge la liste après modification
                handleCloseEditModal(); // Ferme le modal après modification
            } else {
                console.error("Erreur lors de la modification de module :", response);
            }
        } catch (error) {
            console.error("Erreur lors de la modification de module :", error);
        }
    };

    

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Option {idOption} - Modules</Card.Title>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Gérer les modules</span>
                                <Button style={{
                                        backgroundColor: "#056cd4", 
                                        borderColor: "#056cd4", 
                                        color: "#ffffff"
                                    }}onClick={handleShowModal}>
                                    Ajouter un module
                                </Button>
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
                                        {modules.map((module, index) => (
                                            <tr key={module.idModule}>
                                                <td>{index + 1}</td>
                                                <td>{module.nomModule}</td>
                                                
                                                <td>
                                                    <FaEdit
                                                        size={24}
                                                        color="DodgerBlue"
                                                        style={{ cursor: 'pointer', marginRight: '10px' ,color: '#056cd4'}}
                                                        onClick={() => handleEditModal(module)} // Ouvre le modal d'édition
                                                    />
                                                    <FaRegTrashAlt
                                                        size={24}
                                                        color="red"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => confirmDelete(module.idModule)} // Ouvre le modal de suppression
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal pour ajouter un enseignant */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un module</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNom">
                            <Form.Label>Nom du module</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom"
                                name="nomModule"
                                value={newModuleName}
                                onChange={(e) => setNewModuleName(e.target.value)}
                                isInvalid={!!errors.nomModule}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nomModule}
                            </Form.Control.Feedback>

                        </Form.Group>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                    <Button style={{backgroundColor:'#056cd4'}} variant="primary" onClick={handleAddModule}>
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
                    <p>Êtes-vous sûr de vouloir supprimer ce module ?</p>
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
                    <Modal.Title>Modifier le module</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNom">
                            <Form.Label>Nom du Module</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom"
                                name="nomModule"
                                value={moduleToEdit?.nomModule ?? ''}
                                onChange={e => setModuleToEdit({...moduleToEdit, nomModule: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Fermer
                    </Button>
                    <Button style={{backgroundColor:'#056cd4'}} variant="primary" onClick={handleEditModule}>
                        Modifier
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default ModuleTable;
