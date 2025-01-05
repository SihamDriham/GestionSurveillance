import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SurveillanceTable = () => {
    const [sessionList, setSessionList] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState({
        personnel: [],
        surveillances: []
    });    const { idSession } = useParams();
    const navigate = useNavigate();

    // Liste des jours fériés 2025
    const joursFeries = [
        '2025-01-01', '2025-01-21', '2025-02-01', '2025-08-05',
        '2025-05-29', '2025-07-14', '2025-08-15',
    ];

    useEffect(() => {
        fetchSession();
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartment && sessionList) {
            fetchTeachers();
        }
    }, [selectedDepartment]);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get('http://localhost:3600/surveillance/api/departements/allDepartements', config);
            setDepartments(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des départements :", error);
        }
    };

    const fetchSession = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`http://localhost:3600/surveillance/session/session/${idSession}`, config);
            setSessionList(response.data);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des sessions :", error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`http://localhost:3600/surveillance/api/surveillance/details`, config);
            const data = response.data;
            
            // Créer des objets uniques pour les surveillants et réservistes
            const uniquePersonnel = [];
            data.forEach(item => {
                // Ajouter les surveillants
                const surveillantExists = uniquePersonnel.some(
                    p => p.nom === item.surveillantNom && p.prenom === item.surveillantPrenom && p.type === 'surveillant'
                );
                if (item.surveillantNom && item.surveillantPrenom && !surveillantExists) {
                    uniquePersonnel.push({
                        nom: item.surveillantNom,
                        prenom: item.surveillantPrenom,
                        type: 'surveillant'
                    });
                }
                
                // Ajouter les réservistes
                const reservisteExists = uniquePersonnel.some(
                    p => p.nom === item.reservisteNom && p.prenom === item.reservistePrenom && p.type === 'reserviste'
                );
                if (item.reservisteNom && item.reservistePrenom && !reservisteExists) {
                    uniquePersonnel.push({
                        nom: item.reservisteNom,
                        prenom: item.reservistePrenom,
                        type: 'reserviste'
                    });
                }
            });
    
            setTeachers({
                personnel: uniquePersonnel,
                surveillances: data
            });
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des surveillances :", error);
        }
    };

    const getRole = (personnel) => {
        if (personnel.type === 'reserviste') {
            return "RR";
        }
        const roles = ["TT", "NO", "B"];
        return roles[Math.floor(Math.random() * roles.length)];
    };

    const generateDaysBetweenDates = (startDate, endDate) => {
        if (!startDate || !endDate) return [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = [];
        while (start <= end) {
            days.push(new Date(start));
            start.setDate(start.getDate() + 1);
        }
        return days;
    };

    const isJourFerie = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return joursFeries.includes(dateStr);
    };

    const isDimanche = (date) => date.getDay() === 0;

    const isJourDesactive = (date) => isJourFerie(date) || isDimanche(date);

    const getCellStyle = (date) => {
        if (isJourDesactive(date)) {
            return {
                backgroundColor: '#f5f5f5',
                color: '#999',
                cursor: 'not-allowed'
            };
        }
        return {
            cursor: 'pointer',
            backgroundColor: 'white'
        };
    };

    if (!sessionList) {
        return <div>Chargement des données...</div>;
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">
                                Surveillances
                                <select 
                                    className="form-select ms-3 d-inline-block w-auto"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                >
                                    <option value="">Sélectionner un département</option>
                                    {departments.map((department) => (
                                        <option key={department.idDept} value={department.idDept}>
                                            {department.nomDept}
                                        </option>
                                    ))}
                                </select>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Enseignants</th>
                                        {generateDaysBetweenDates(sessionList.dateDebut, sessionList.dateFin).map((day, index) => (
                                            <React.Fragment key={index}>
                                                <th colSpan="4" className="text-center border-start">
                                                    {day.toLocaleDateString()}
                                                </th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                    <tr>
                                        <th></th>
                                        {generateDaysBetweenDates(sessionList.dateDebut, sessionList.dateFin).map((day, index) => (
                                            <React.Fragment key={index}>
                                                <th className="border-start">{`${sessionList.heureDebut1 || ''} - ${sessionList.heureFin1 || ''}`}</th>
                                                <th>{`${sessionList.heureDebut2 || ''} - ${sessionList.heureFin2 || ''}`}</th>
                                                <th>{`${sessionList.heureDebut3 || ''} - ${sessionList.heureFin3 || ''}`}</th>
                                                <th>{`${sessionList.heureDebut4 || ''} - ${sessionList.heureFin4 || ''}`}</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
    {teachers?.personnel?.map((person, index) => (
        <tr key={`${person.type}-${index}`}>
            <td>{`${person.prenom} ${person.nom}`}</td>
            {generateDaysBetweenDates(sessionList.dateDebut, sessionList.dateFin).map((day, dayIndex) => {
                const formattedDay = day.toISOString().split('T')[0];
                const surveillancesForDay = teachers.surveillances.filter(t => {
                    if (person.type === 'surveillant') {
                        return t.date.split('T')[0] === formattedDay &&
                               t.surveillantNom === person.nom &&
                               t.surveillantPrenom === person.prenom;
                    } else {
                        return t.date.split('T')[0] === formattedDay &&
                               t.reservisteNom === person.nom &&
                               t.reservistePrenom === person.prenom;
                    }
                });

                return (
                    <React.Fragment key={dayIndex}>
                        {[...Array(4)].map((_, timeIndex) => {
                            const surveillance = surveillancesForDay.find(
                                t =>
                                    t.heureDebut === sessionList[`heureDebut${timeIndex + 1}`] &&
                                    t.heureFin === sessionList[`heureFin${timeIndex + 1}`]
                            );

                            return (
                                <td
                                    key={timeIndex}
                                    style={getCellStyle(day)}
                                    className={isJourDesactive(day) ? "text-muted" : ""}
                                >
                                    {surveillance && (
                                        <div>
                                        
                                            <div className="text-center font-weight-bold">
                                                {person.type === 'reserviste' ? 'RR' : getRole(surveillance)}
                                            </div>
                                        </div>
                                    )}
                                </td>
                            );
                        })}
                    </React.Fragment>
                );
            })}
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

export default SurveillanceTable;