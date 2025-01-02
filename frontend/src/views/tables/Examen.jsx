import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaRegTrashAlt } from "react-icons/fa";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const SessionTable = () => {

    const [examToDelete, setExamToDelete] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const location = useLocation();

    const { date, heureDebut, heureFin } = location.state || {};

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    const [examens, setExamens] = useState([]);

    const [locaux, setLocaux] = useState([]);
    const [idLocaux, setIdLocaux] = useState([]);

    const [departement, setDepartement] = useState([]);
    const [idDept, setIdDept] = useState('');

    const [options, setOptions] = useState([]);
    const [idOption, setIdOption] = useState('');

    const [enseignant, setEnseignant] = useState([]);
    const [id_enseignant, setIdEnseignant] = useState('');

    const [modules, setModules] = useState([]);
    const [id_module, setIdModule] = useState('');

    const [nbEtudiant, setNbEtudiant] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const {idSession} = useParams();

    // Fonction pour gérer la sélection des locaux
    const handleLocauxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            // Ajouter le local sélectionné
            setIdLocaux(prevLocaux => [...prevLocaux, value]);
        } else {
            // Retirer le local décoché
            setIdLocaux(prevLocaux => prevLocaux.filter(local => local !== value));
        }
    };

    useEffect(() => {
        fetchExamens();
        fetchDepartement();
        fetchOption();
        fetchLocaux();
    }, []);

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
            const response = await axios.get('http://localhost:3600/surveillance/api/departements/allDepartements',config);
            if (Array.isArray(response.data)) {
                setDepartement(response.data);
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des departements :", error);
        }
    };

    const fetchEnseignant = async (idDept) => {
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
            const response = await axios.get(`http://localhost:3600/surveillance/api/enseignants/allEnsegnant/${idDept}`,config);
            if (Array.isArray(response.data)) {
                setEnseignant(response.data);
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des sessions :", error);
        }
    };

    const fetchOption = async () => {
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
            const response = await axios.get('http://localhost:3600/surveillance/api/option/allOption',config);
            if (Array.isArray(response.data)) {
                setOptions(response.data);
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des sessions :", error);
        }
    };

    const fetchModule = async (idOption) => {
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
            const response = await axios.get(`http://localhost:3600/surveillance/api/module/allModule/${idOption}`,config);
            if (Array.isArray(response.data)) {
                setModules(response.data);
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des sessions :", error);
        }
    };

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
            const response = await axios.get('http://localhost:3600/surveillance/api/locaux/allLocaux',config);
            if (Array.isArray(response.data)) {
                setLocaux(response.data);
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des sessions :", error);
        }
    };

    const handleAddExamen = async () => {
        console.log("Locaux sélectionnés:", idLocaux);
        const formattedDate = formatDate(date);
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
            await axios.post(
                'http://localhost:3600/surveillance/api/examen/save',
                {
                    date: formattedDate,
                    heureDebut: heureDebut,
                    heureFin: heureFin,
                    id_session: Number(idSession),
                    id_module: Number(id_module),
                    id_enseignant: Number(id_enseignant),
                    nbEtudiant: Number(nbEtudiant),
                    idLocaux: idLocaux.map(Number),
                },config
            );

            setShowModal(false); // Close modal
            // Reset form fields
            setIdEnseignant("");
            setIdModule("");
            setIdOption("");
            setIdLocaux("");
            setIdDept("");
            setNbEtudiant("");
            setIdLocaux([]);
            fetchExamens();

        } catch (error) {
            console.error("Une erreur s'est produite lors de l'ajout d'examen :", error);
        }
    };

    const fetchExamens = async () => {
        const formattedDate = formatDate(date);
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
            const response = await axios.post('http://localhost:3600/surveillance/api/examen/examens', {
                idSession:  Number(idSession),
                date: formattedDate,
                heureDebut: heureDebut,
                heureFin: heureFin
            },config);
            
            if (Array.isArray(response.data)) {
                setExamens(response.data);
                console.log(response.data);
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des sessions :", error);
        }
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
                `http://localhost:3600/surveillance/api/examen/delete/${examToDelete}`,config
            );

            fetchExamens();
            setShowConfirmModal(false);
            setExamToDelete(null); // Réinitialiser le département à supprimer
        } catch (error) {
            console.error("Erreur lors de la suppression du département :", error);
        }
    };

    const confirmDelete = (idExamen) => {
        setExamToDelete(idExamen);
        setShowConfirmModal(true);
    };
   
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Examen</Card.Title>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="d-block m-t-5">
                                    Gérer les examens
                                </span>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        backgroundColor: "#056cd4", 
                                        borderColor: "#056cd4", 
                                        color: "#ffffff" 
                                    }}
                                    onClick={() => {
                                        setShowModal(true); 
                                        setShowError(false);  
                                    }}
                                    >
                                    Ajouter un examen
                                </button>
                            </div>
                            
                        </Card.Header>
                        <Card.Body>
                           {/* Table des examens */}
                            <Table responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Option</th>
                                    <th>Module</th>
                                    <th>Enseignant</th>
                                    <th>Nombre d'Étudiants</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {examens.map((examen, index) => (
                                    <tr key={examen.idExamen}>
                                    <td>{index+1}</td>
                                    <td>{examen.module.option.nomOption}</td>
                                    <td>{examen.module.nomModule}</td>             
                                    <td>{examen.enseignant.nom} {examen.enseignant.prenom}</td>
                                    <td>{examen.nbEtudiant}</td>
                                    <td>
                                        <FaRegTrashAlt
                                            size={24}
                                            color="red"
                                            onClick={() => confirmDelete(examen.idExamen)}
                                            style={{ marginRight: '10px', cursor: 'pointer' }}
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

            {/* Modal pour Ajouter un Examen */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{"Ajouter un Examen"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Row>
                                {/* Département */}
                                <Col md={6}>
                                <Form.Label>Responsable du module</Form.Label>
                                <Form.Control
                                        as="select"
                                        value={idDept}
                                        onChange={(e) => {
                                            const selectedDept = e.target.value;
                                            setIdDept(selectedDept);
                                            if (selectedDept) {
                                                fetchEnseignant(selectedDept); // Charger les enseignants associés
                                            } else {
                                                setEnseignant([]); // Réinitialiser si aucun département n'est sélectionné
                                            }
                                        }}
                                    >
                                        <option value="">Choisir...</option>
                                        {departement.map((dept) => (
                                            <option key={dept.idDept} value={dept.idDept}>
                                                {dept.nomDept}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>

                                {/* Enseignant */}
                                <Col md={6}>
                                    <Form.Label>:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={id_enseignant}
                                        onChange={(e) => setIdEnseignant(e.target.value)}
                                    >
                                        <option value="">Choisir...</option>
                                        {enseignant.map((ens) => (
                                            <option key={ens.id} value={ens.id}>
                                                {ens.nom} {ens.prenom}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Option</Form.Label>
                            <Form.Control
                                as="select"
                                value={idOption}
                                onChange={(e) => {
                                    const selectedOption = e.target.value;
                                    setIdOption(selectedOption);
                                    if (selectedOption) {
                                        fetchModule(selectedOption); // Charger les modules associés
                                    } else {
                                        setModules([]); // Réinitialiser si aucune option n'est sélectionnée
                                    }
                                }}
                            >
                                <option value="">Choisir...</option>
                                {options.map((opt) => (
                                    <option key={opt.idOption} value={opt.idOption}>
                                        {opt.nomOption}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Module</Form.Label>
                            <Form.Control
                                as="select"
                                value={id_module}
                                onChange={(e) => setIdModule(e.target.value)}
                            >
                                <option value="">Choisir...</option>
                                {modules.map((mdl) => (
                                    <option key={mdl.idModule} value={mdl.idModule}>
                                        {mdl.nomModule}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>


                        <Form.Group>
                            <Form.Label>Nombre des étudiants inscrits</Form.Label>
                            <Form.Control
                                type="number"
                                value={nbEtudiant}
                                onChange={(e) => setNbEtudiant(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
    <Form.Label>Liste des locaux</Form.Label>
    <Form.Control
        as="select"
        multiple  // Permet la sélection multiple
        value={idLocaux} // Doit être un tableau pour supporter plusieurs valeurs
        onChange={(e) => {
            // Extraire les options sélectionnées et les mettre dans un tableau d'entiers
            const selectedLocaux = Array.from(e.target.selectedOptions, option => option.value);
            setIdLocaux(selectedLocaux); // Mettre à jour l'état avec le tableau des locaux sélectionnés
        }}
    >
        <option value="">Choisir...</option>
        {locaux.map((local) => (
            <option key={local.idLocaux} value={local.idLocaux}>
                {local.nomLocaux}
            </option>
        ))}
    </Form.Control>
</Form.Group>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button style={{ backgroundColor: '#056cd4' }} variant="primary" onClick={handleAddExamen}>
                        Créer
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmation de suppression */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer cet examen ?
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

export default SessionTable;