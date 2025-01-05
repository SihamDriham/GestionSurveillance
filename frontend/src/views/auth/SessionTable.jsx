import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Modal, Form, Button } from 'react-bootstrap';
import { FaRegTrashAlt,FaBan, FaEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SessionTable = () => {

    

    const [sessionList, setSessionList] = useState([]);
    const [filteredSessionList, setFilteredSessionList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showValidermModal, setShowValidermModal] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [sessionToValide, setSessionToValide] = useState(null);

    //------------------------------------
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const [searchQuery, setSearchQuery] = useState(""); // New state for search input

    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [heureDebut1, setHeureDebut1] = useState('08:00');
    const [heureFin1, setHeureFin1] = useState('10:00');
    const [heureDebut2, setHeureDebut2] = useState('10:00');
    const [heureFin2, setHeureFin2] = useState('12:00');
    const [heureDebut3, setHeureDebut3] = useState('02:00');
    const [heureFin3, setHeureFin3] = useState('04:00');
    const [heureDebut4, setHeureDebut4] = useState('04:00');
    const [heureFin4, setHeureFin4] = useState('06:00');
    const [id_type_session, setIdTypeSession] = useState('');

    const [typeList, setTypeList] = useState([]);

    useEffect(() => {
        fetchSession();
        fetchType();
    }, []);

    useEffect(() => {
        // Filter the sessions based on the search query
        if (searchQuery === "") {
            setFilteredSessionList(sessionList);
        } else {
            const filteredSessions = sessionList.filter(session =>
                session.nomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                new Date(session.dateDebut).toLocaleDateString().includes(searchQuery) ||
                new Date(session.dateFin).toLocaleDateString().includes(searchQuery)
            );
            setFilteredSessionList(filteredSessions);
        }
    }, [searchQuery, sessionList]);

    const fetchSession = async () => {
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

            const response = await axios.get('http://localhost:3600/surveillance/session/allSessions', config);
            if (Array.isArray(response.data)) {
                setSessionList(response.data);
                setFilteredSessionList(response.data); // Set filtered session list to initial session list
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des sessions :", error);
        }
    };

    const fetchType = async () => {
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
            const response = await axios.get('http://localhost:3600/surveillance/api/type/allType',config);
            if (Array.isArray(response.data)) {
                setTypeList(response.data);
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des sessions :", error);
        }
    };

    const handleAddSession = async () => {
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
                'http://localhost:3600/surveillance/session/save',
                {
                    date_debut: dateDebut,
                    date_fin: dateFin,
                    heureDebut1: heureDebut1,
                    heureFin1: heureFin1,
                    heureDebut2: heureDebut2,
                    heureFin2: heureFin2,
                    heureDebut3: heureDebut3,
                    heureFin3: heureFin3,
                    heureDebut4: heureDebut4,
                    heureFin4: heureFin4,
                    id_type_session: Number(id_type_session),
                },config
            );

            setShowModal(false); // Close modal
            // Reset form fields
            setDateDebut(null);
            setDateFin(null);
            setHeureDebut1("08:00");
            setHeureFin1("10:00");
            setHeureDebut2("10:00");
            setHeureFin2("12:00");
            setHeureDebut3("02:00");
            setHeureFin3("04:00");
            setHeureDebut4("04:00");
            setHeureFin4("06:00");
            setIdTypeSession("");

            fetchSession(); // Refresh session list

            if (!file) {
                setUploadStatus("Veuillez sélectionner un fichier.");
                return;
              }
          
              const formData = new FormData();
              formData.append("file", file);
          
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
                const response = await axios.post("http://localhost:3600/surveillance/session/uploadExcel", formData, config,{
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
                setUploadStatus(response.data); // Message de succès
                fetchSession(); // Recharger les données après l'import
              } catch (error) {
                console.error("Erreur lors de l'upload :", error);
                setUploadStatus("Échec de l'importation du fichier.");
            }

            fetchSession(); // Refresh session list
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'ajout ou de la modification du département :", error);
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
                `http://localhost:3600/surveillance/session/delete/${sessionToDelete}`,
                config
            );

            fetchSession();
            setShowConfirmModal(false);
            setSessionToDelete(null);
        } catch (error) {
            console.error("Erreur lors de la suppression du département :", error);
        }
    };

    const confirmDelete = (idSession) => {
        setSessionToDelete(idSession);
        setShowConfirmModal(true);
    };

    const handleValide = async () => {
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
            await axios.put(
                `http://localhost:3600/surveillance/session/update/${sessionToValide}`,
                {}, 
                config
            );

            await axios.post(
                'http://localhost:3600/surveillance/api/surveillance/planifier',
                { idSession: sessionToValide }, 
                config
            );            

            fetchSession();
            setShowValidermModal(false);
            setSessionToValide(null);
        } catch (error) {
            console.error("Erreur lors de la validation du session :", error);
        }
    };

    const confirmValide = (idSession) => {
        setSessionToValide(idSession);
        setShowValidermModal(true);
    };

    const handleDashbord = (idSession) => {
        window.location.href = `sessionDashboard/${idSession}`;
    };


    //-------------------------------------------------------
    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Récupère le fichier sélectionné
    };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Sessions</Card.Title>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="d-block m-t-5">
                                    Gérer les sessions
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
                                    Ajouter une session
                                </button>
                            </div>
                            <Form.Control
                                type="text"
                                placeholder="Rechercher une session"
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
                                        <th>Type</th>
                                        <th>Date de Début</th>
                                        <th>Date de Fin</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSessionList.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                Aucune session trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSessionList.map((session, index) => (
                                            <tr key={session.idSession}>
                                                <td>{index + 1}</td>
                                                <td>{session.nomType}</td>
                                                <td>{new Date(session.dateDebut).toLocaleDateString('en-US', { 
                                                    month: 'long', day: 'numeric', year: 'numeric' 
                                                    }).replace(/(\d)(st|nd|rd|th)/, '$1$2')}
                                                </td>
                                                <td>{new Date(session.dateFin).toLocaleDateString('en-US', { 
                                                    month: 'long', day: 'numeric', year: 'numeric' 
                                                    }).replace(/(\d)(st|nd|rd|th)/, '$1$2')}
                                                </td>
                                                <td>
                                                    <FaRegTrashAlt
                                                        size={24}
                                                        color="red"
                                                        onClick={() => confirmDelete(session.idSession)}
                                                        style={{ marginRight: '10px', cursor: 'pointer' }}
                                                    />
                                                    <FaBan
                                                        size={24}
                                                        color={session.valider ? 'gray' : 'green'} // Modifier la couleur selon la validation
                                                        onClick={() => confirmValide(session.idSession)}
                                                        style={{ marginRight: '10px', cursor: session.isValidated ? 'not-allowed' : 'pointer' }} // Désactiver le clic si validé
                                                    />
                                                    <CgDetailsMore
                                                        size={24}
                                                        color="DarkSlateGray"
                                                        onClick={() => handleDashbord(session.idSession)}
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

            {/* Modal pour Ajouter une Session */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{"Ajouter une Session"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Type de Session</Form.Label>
                            <Form.Control
                                as="select"
                                value={id_type_session}
                                onChange={(e) => setIdTypeSession(e.target.value)}
                            >
                                <option value="">Choisir...</option>
                                {typeList.map((type) => (
                                    <option key={type.idTypeSession} value={type.idTypeSession}>
                                        {type.nomType}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Date de Début</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateDebut}
                                onChange={(e) => setDateDebut(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Date de Fin</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateFin}
                                onChange={(e) => setDateFin(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Heures de Début et de Fin</Form.Label>
                            <div className="d-flex">
                                <Form.Control
                                    type="time"
                                    value={heureDebut1}
                                    onChange={(e) => setHeureDebut1(e.target.value)}
                                    placeholder="Heure Début 1"
                                />
                                <Form.Control
                                    type="time"
                                    value={heureFin1}
                                    onChange={(e) => setHeureFin1(e.target.value)}
                                    placeholder="Heure Fin 1"
                                />
                                <Form.Control
                                    type="time"
                                    value={heureDebut2}
                                    onChange={(e) => setHeureDebut2(e.target.value)}
                                    placeholder="Heure Début 2"
                                />
                                <Form.Control
                                    type="time"
                                    value={heureFin2}
                                    onChange={(e) => setHeureFin2(e.target.value)}
                                    placeholder="Heure Fin 2"
                                />
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <div className="d-flex">
                                <Form.Control
                                    type="time"
                                    value={heureDebut3}
                                    onChange={(e) => setHeureDebut3(e.target.value)}
                                    placeholder="Heure Début 3"
                                />
                                <Form.Control
                                    type="time"
                                    value={heureFin3}
                                    onChange={(e) => setHeureFin3(e.target.value)}
                                    placeholder="Heure Fin 3"
                                />
                                <Form.Control
                                    type="time"
                                    value={heureDebut4}
                                    onChange={(e) => setHeureDebut4(e.target.value)}
                                    placeholder="Heure Début 4"
                                />
                                <Form.Control
                                    type="time"
                                    value={heureFin4}
                                    onChange={(e) => setHeureFin4(e.target.value)}
                                    placeholder="Heure Fin 4"
                                />
                            </div>
                        </Form.Group>
                        {/* l'importation du fichier */}
                        <Form.Group>
                            <Form.Label>Importer un fichier Excel</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".xls,.xlsx"
                                onChange={handleFileChange}
                            />
                            {uploadStatus && <p>{uploadStatus}</p>}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button style={{ backgroundColor: '#056cd4' }} variant="primary" onClick={handleAddSession}>
                        Créer
                    </Button>
                    {/* le Button de l'importation*/}
                    
                </Modal.Footer>
            </Modal>

            {/* Modal pour Confirmation de suppression */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.</p>
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

            {/* Modal pour Confirmation de validation */}
            <Modal show={showValidermModal} onHide={() => setShowValidermModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la validation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Êtes-vous sûr de vouloir valider cette session ? Cette action est irréversible.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowValidermModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleValide}>
                        Valider
                    </Button>
                </Modal.Footer>
            </Modal>

        </React.Fragment>
    );
};

export default SessionTable;
