import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams, useNavigate } from 'react-router-dom';
const ExamTable = () => {
    const [sessionList, setSessionList] = useState(null); // Par défaut, null pour indiquer qu'aucune donnée n'est chargée
    const { idSession } = useParams();
    const navigate = useNavigate();

    // Liste des jours fériés 2025
    const joursFeries = [
        '2025-01-01', // Jour de l'an
        '2025-01-21', // Lundi de Pâques
        '2025-08-05', // Victoire 1945
        '2025-05-29', // Ascension
        '2025-07-14', // Lundi de Pentecôte
        '2025-08-15', // Fête nationale
    ];

    useEffect(() => {
        fetchSession();
    }, []);

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
            const response = await axios.get(`http://localhost:3600/surveillance/session/session/${idSession}`, config);
            setSessionList(response.data);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des sessions :", error);
        }
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

    const isDimanche = (date) => {
        return date.getDay() === 0;
    };

    const isJourDesactive = (date) => {
        return isJourFerie(date) || isDimanche(date);
    };

    const handleCellClick = (day, heureDebut, heureFin) => {
        if (isJourDesactive(day)) {
            return; // Ne rien faire si le jour est désactivé
        }
        navigate(`/${idSession}/Examen`, {
            state: {
                date: day.toLocaleDateString(),
                heureDebut,
                heureFin
            }
        });
    };

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

    // Affichage conditionnel si les données ne sont pas encore chargées
    if (!sessionList) {
        return <div>Chargement des données...</div>;
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Examens</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Jours</th>
                                        <th>{`${sessionList.heureDebut1 || ''} - ${sessionList.heureFin1 || ''}`}</th>
                                        <th>{`${sessionList.heureDebut2 || ''} - ${sessionList.heureFin2 || ''}`}</th>
                                        <th>{`${sessionList.heureDebut3 || ''} - ${sessionList.heureFin3 || ''}`}</th>
                                        <th>{`${sessionList.heureDebut4 || ''} - ${sessionList.heureFin4 || ''}`}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generateDaysBetweenDates(sessionList.dateDebut, sessionList.dateFin).map((day, index) => (
                                        <tr key={index}>
                                            <td style={getCellStyle(day)}>
                                                {day.toLocaleDateString()}
                                                {isJourFerie(day) && <span className="ms-2">(Férié)</span>}
                                                {isDimanche(day) && <span className="ms-2">(Dimanche)</span>}
                                            </td>
                                            <td 
                                                style={getCellStyle(day)}
                                                onClick={() => handleCellClick(day, sessionList.heureDebut1, sessionList.heureFin1)}
                                            ></td>
                                            <td 
                                                style={getCellStyle(day)}
                                                onClick={() => handleCellClick(day, sessionList.heureDebut2, sessionList.heureFin2)}
                                            ></td>
                                            <td 
                                                style={getCellStyle(day)}
                                                onClick={() => handleCellClick(day, sessionList.heureDebut3, sessionList.heureFin3)}
                                            ></td>
                                            <td 
                                                style={getCellStyle(day)}
                                                onClick={() => handleCellClick(day, sessionList.heureDebut4, sessionList.heureFin4)}
                                            ></td>
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

export default ExamTable;
