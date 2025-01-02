import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const OptionTable = () => {
    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingOption, setEditingOption] = useState(null);
    const [optionToDelete, setOptionToDelete] = useState(null);
    const [newOption, setNewOption] = useState({
        nomOption: ''
    });
    const [errors, setErrors] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    const { idSession } = useParams();

    // Récupérer les options depuis l'API
    useEffect(() => {
        fetchOptions();
    }, []);

    // Appliquer la recherche sur les options
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredOptions(options);
        } else {
            setFilteredOptions(
                options.filter(option =>
                    option.nomOption.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, options]);

    // Récupérer les options de l'API
    const fetchOptions = async () => {
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
            const response = await axios.get('http://localhost:3600/surveillance/api/option/allOption', config);
            setOptions(response.data || []);
            setFilteredOptions(response.data || []);
        } catch (error) {
            console.error('Erreur lors de la récupération des options :', error);
        }
    };

    // Gérer les changements dans le champ de recherche
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Gérer les changements de champ dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewOption({ ...newOption, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    // Validation des champs du formulaire
    const validateOption = () => {
        const errorMessages = {};
        let isValid = true;

        if (!newOption.nomOption.trim()) {
            errorMessages.nomOption = 'Le nom de l\'option est requis.';
            isValid = false;
        }

        setErrors(errorMessages);
        return isValid;
    };

    // Enregistrer une option (ajout ou modification)
    const handleSaveOption = async () => {
        setFormSubmitted(true);
        if (!validateOption()) return;

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
            if (editingOption) {
                await axios.put(
                    `http://localhost:3600/surveillance/api/option/update/${editingOption.idOption}`,
                    newOption,
                    config
                );
            } else {
                await axios.post(
                    'http://localhost:3600/surveillance/api/option/save',
                    newOption,
                    config
                );
            }
            fetchOptions();
            resetForm();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
        }
    };

    // Réinitialiser le formulaire
    const resetForm = () => {
        setShowModal(false);
        setEditingOption(null);
        setNewOption({ nomOption: '' });
        setFormSubmitted(false);
    };

    // Confirmer la suppression
    const confirmDelete = (id) => {
        setOptionToDelete(id); // Mettre à jour l'état de suppression
    };

    // Supprimer une option
    const handleDelete = async () => {
        if (!optionToDelete) {
            console.error('Aucune option à supprimer.');
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
            const response = await axios.delete(
                `http://localhost:3600/surveillance/api/option/delete/${optionToDelete}`,
                config
            );
            console.log('Option supprimée', response.data);
            fetchOptions(); // Récupérer les options après la suppression
            setOptionToDelete(null); // Réinitialiser l'état de suppression après la suppression
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'option :', error);
        }
    };

    const navigate = useNavigate();


    const handleModule = (idOption) => {
        navigate(`/${idSession}/Modules/${idOption}`);
    };

    // Ouvrir le modal pour ajouter ou modifier une option
    const openModal = (option = null) => {
        setEditingOption(option);
        setNewOption(option || { nomOption: '' });
        setOptionToDelete(null);
        setShowModal(true);
        setFormSubmitted(false);
    };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Options</Card.Title>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Gérer les options</span>
                                <Button
                                    style={{
                                        backgroundColor: "#056cd4",
                                        borderColor: "#056cd4",
                                        color: "#ffffff"
                                    }}
                                    variant="primary"
                                    onClick={() => openModal()}
                                >
                                    Ajouter une option
                                </Button>
                            </div>
                            <Form.Control
                                type="text"
                                placeholder="Rechercher une option"
                                style={{ marginTop: '10px', width: '26%', borderRadius: '1' }}
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
                                        <th>Nom de l'option</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOptions.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" className="text-center">
                                                Aucune option trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOptions.map((option, index) => (
                                            <tr key={option.idOption}>
                                                <td>{index+1}</td>
                                                <td>{option.nomOption}</td>
                                                <td>
                                                    <FaEdit
                                                        size={24}
                                                        color="#056cd4"
                                                        onClick={() => openModal(option)}
                                                        style={{ marginRight: '10px', cursor: 'pointer' }}
                                                    />
                                                    <FaRegTrashAlt
                                                        size={24}
                                                        color="red"
                                                        onClick={() => confirmDelete(option.idOption)} // Met à jour l'état de suppression
                                                        style={{ marginRight: '10px', cursor: 'pointer' }}
                                                    />
                                                                                                    
                                                    <CgDetailsMore
                                                        size={24}
                                                        color="DarkSlateGray"
                                                        onClick={() => handleModule(option.idOption)}
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
                    <Modal.Title>{editingOption ? 'Modifier l\'option' : 'Ajouter une option'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nom de l'option</Form.Label>
                            <Form.Control
                                type="text"
                                name="nomOption"
                                value={newOption.nomOption}
                                onChange={handleChange}
                                isInvalid={formSubmitted && errors.nomOption}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nomOption}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={resetForm}>
                        Annuler
                    </Button>
                    <Button
                        style={{
                            backgroundColor: "#056cd4",
                            borderColor: "#056cd4",
                            color: "#ffffff"
                        }}
                        onClick={handleSaveOption}
                    >
                        {editingOption ? 'Modifier' : 'Ajouter'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Popup confirmation suppression */}
            <Modal show={optionToDelete !== null} onHide={() => setOptionToDelete(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Voulez-vous vraiment supprimer cette option ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOptionToDelete(null)}>
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

export default OptionTable;

