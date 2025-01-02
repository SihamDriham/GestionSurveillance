import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table} from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams, useNavigate } from 'react-router-dom';

const SessionTable = () => {
    const [sessionList, setSessionList] = useState([]);

    const {idSession} = useParams()

    const navigate = useNavigate();

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
            const response = await axios.get(`http://localhost:3600/surveillance/session/session/${idSession}`,config);
                setSessionList(response.data);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des sessions :", error);
        }
    };

    const generateDaysBetweenDates = (startDate, endDate) => {
     const start = new Date(startDate);
     const end = new Date(endDate);
     const days = [];
 
     while (start <= end) {
       days.push(new Date(start));
       start.setDate(start.getDate() + 1); // Passer au jour suivant
     }
     return days;
   };

   const handleCellClick = (day, heureDebut, heureFin) => {
    // Redirection vers une autre page avec les données nécessaires
    navigate(`/${idSession}/Examen`, {
        state: {
            date: day.toLocaleDateString(),
            heureDebut,
            heureFin
        }
    });
   };

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
                                 <tr >
                                  <th>Jours</th>
                                   <th>{`${sessionList.heureDebut1} - ${sessionList.heureFin1}`}</th>
                                   <th>{`${sessionList.heureDebut2} - ${sessionList.heureFin2}`}</th>
                                   <th>{`${sessionList.heureDebut3} - ${sessionList.heureFin3}`}</th>
                                   <th>{`${sessionList.heureDebut4} - ${sessionList.heureFin4}`}</th>
                                 </tr>
                             </thead>
                             <tbody>
                             {generateDaysBetweenDates(sessionList.dateDebut, sessionList.dateFin).map((day, index) => (
                             <tr key={index}>
                               <td>{day.toLocaleDateString()}</td>
                               <td onClick={() => handleCellClick(day, sessionList.heureDebut1, sessionList.heureFin1)}></td>
                               <td onClick={() => handleCellClick(day, sessionList.heureDebut2, sessionList.heureFin2)}></td>
                               <td onClick={() => handleCellClick(day, sessionList.heureDebut3, sessionList.heureFin3)}></td>
                               <td onClick={() => handleCellClick(day, sessionList.heureDebut4, sessionList.heureFin4)}></td>
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

export default SessionTable;
