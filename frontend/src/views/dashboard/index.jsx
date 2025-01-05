import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaGraduationCap, FaUserTie, FaBuilding, FaEye } from 'react-icons/fa';
import axios from 'axios'; // Assurez-vous d'avoir installé axios
import * as d3 from "d3";
import { useParams } from 'react-router-dom';

function generateNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getDatum() {
  let data = [];
  const len = 4;

  for (let i = 0; i < len; i++) {
    data.push({
      x: `Session ${i + 1}`,
      y0: generateNumber(10, 50)
    });
  }

  return data;
}

const DashDefault = () => {
  const [departmentsCount, setDepartmentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [examsCount, setExamsCount] = useState(0);
  const { idSession } = useParams();

  

  // Effect to fetch the counts of departments and teachers
  useEffect(() => {
    
    localStorage.setItem('idSession', idSession);

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
    // Fetch count of departments
    axios.get('http://localhost:3600/surveillance/api/departements/count',config)
      .then(response => {
        setDepartmentsCount(response.data);
      })
      .catch(error => {
        console.error('Error fetching department count:', error);
      });

    // Fetch count of teachers
    axios.get('http://localhost:3600/surveillance/api/enseignants/count',config)
      .then(response => {
        setTeachersCount(response.data);
      })
      .catch(error => {
        console.error('Error fetching teacher count:', error);
      });

    axios.get(`http://localhost:3600/surveillance/api/examen/countExams/${idSession}`,config)
    .then(response => {
      setExamsCount(response.data);
    })
    .catch(error => {
      console.error('Error fetching exams count:', error);
    });

    // Graphical part (D3)
    const data = getDatum();
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3
      .select("#grouped-column-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const colorScale = d3.scaleOrdinal().range(["#4a90e2", "#28a745", "#ffc107"]);
    const groupKeys = ["y0"];

    // Scales
    const x0 = d3.scaleBand().range([0, width]).domain(data.map((d) => d.x)).padding(0.2);
    const x1 = d3.scaleBand().domain(groupKeys).range([0, x0.bandwidth()]).padding(0.05);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.y0))])
      .range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x0).tickSize(0))
      .selectAll("text")
      .style("font-size", "10px")
      .style("fill", "#6c757d");

    // Add Y axis
    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("font-size", "10px")
      .style("fill", "#6c757d");

    // Add bars
    data.forEach((d) => {
      const groups = svg
        .append("g")
        .selectAll("rect")
        .data(groupKeys)
        .enter()
        .append("rect")
        .attr("x", (key) => x0(d.x) + x1(key))
        .attr("y", (key) => y(d[key]))
        .attr("width", x1.bandwidth())
        .attr("height", (key) => height - y(d[key]))
        .attr("fill", (key) => colorScale(key));
    });
  }, []); // Empty array means this effect runs only once after the initial render

  return (
    <div className="dashboard" style={{ padding: '20px' }}>
      {/* Header Section */}
      
      <Row className="mb-4">
        <Col>
          <h2 style={{ fontWeight: 'bold', color: '#4a90e2' }}>Sessions</h2>
          <p style={{ color: '#6c757d' }}>Gérer les sessions efficacement</p>
        </Col>
      </Row>

      {/* Stats Section */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
            <Card.Body>
              <FaBuilding size={40} color="#ffc107" />
              <h5 style={{ marginTop: '10px', color: '#333' }}>Départements</h5>
              <h2 style={{ fontWeight: 'bold', color: '#ffc107' }}>{departmentsCount}</h2>
              <p style={{ color: '#6c757d' }}>Nombre de département</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
            <Card.Body>
              <FaUserTie size={40} color="#28a745" />
              <h5 style={{ marginTop: '10px', color: '#333' }}>Enseignants</h5>
              <h2 style={{ fontWeight: 'bold', color: '#28a745' }}>{teachersCount}</h2>
              <p style={{ color: '#6c757d' }}>Nombre total d'enseignants dans la faculté</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
            <Card.Body>
              <FaGraduationCap size={40} color="#4a90e2" />
              <h5 style={{ marginTop: '10px', color: '#333' }}>Exams</h5>
              <h2 style={{ fontWeight: 'bold', color: '#4a90e2' }}>{examsCount}</h2>
              <p style={{ color: '#6c757d' }}>Nombre total d'examens du dernier session</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
            <Card.Body>
              <FaEye size={40} color="#dc3545" />
              <h5 style={{ marginTop: '10px', color: '#333' }}>Surveillance actuelle</h5>
              <h3 style={{ fontWeight: 'bold', color: '#dc3545' }}>En cours</h3>
              <p style={{ color: '#6c757d' }}>Surveillance des exmens</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Graphique et examens récents */}
      <Row>
        <Col md={8}>
          <Card className="shadow-sm" style={{ border: "none" }}>
            <Card.Body>
              <h5 style={{ color: "#333" }}>Aperçu</h5>
              <div
                id="grouped-column-chart"
                style={{
                  height: "250px",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                }}
              ></div>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </div>
  );
};

export default DashDefault;




// import React, { useEffect } from 'react';
// import { Row, Col, Card } from 'react-bootstrap';
// import { FaGraduationCap, FaUserTie, FaBuilding, FaEye } from 'react-icons/fa';

// import * as d3 from "d3";

// function generateNumber(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// function getDatum() {
//   let data = [];
//   const len = 12;

//   for (let i = 0; i < len; i++) {
//     data.push({
//       x: `Mois ${i + 1}`,
//       y0: generateNumber(10, 50),
//       y1: generateNumber(10, 40),
//       y2: generateNumber(10, 30),
//     });
//   }

//   return data;
// }

// const DashDefault = () => {
//   useEffect(() => {
//     const data = getDatum();

//     const margin = { top: 20, right: 20, bottom: 40, left: 50 };
//     const width = 500 - margin.left - margin.right;
//     const height = 250 - margin.top - margin.bottom;

//     // Create SVG container
//     const svg = d3
//       .select("#grouped-column-chart")
//       .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", `translate(${margin.left}, ${margin.top})`);

//     const colorScale = d3.scaleOrdinal().range(["#4a90e2", "#28a745", "#ffc107"]);
//     const groupKeys = ["y0", "y1", "y2"];

//     // Scales
//     const x0 = d3.scaleBand().range([0, width]).domain(data.map((d) => d.x)).padding(0.2);
//     const x1 = d3.scaleBand().domain(groupKeys).range([0, x0.bandwidth()]).padding(0.05);
//     const y = d3
//       .scaleLinear()
//       .domain([0, d3.max(data, (d) => Math.max(d.y0, d.y1, d.y2))])
//       .range([height, 0]);

//     // Add X axis
//     svg
//       .append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(d3.axisBottom(x0).tickSize(0))
//       .selectAll("text")
//       .style("font-size", "10px")
//       .style("fill", "#6c757d");

//     // Add Y axis
//     svg
//       .append("g")
//       .call(d3.axisLeft(y).ticks(5))
//       .selectAll("text")
//       .style("font-size", "10px")
//       .style("fill", "#6c757d");

//     // Add bars
//     data.forEach((d) => {
//       const groups = svg
//         .append("g")
//         .selectAll("rect")
//         .data(groupKeys)
//         .enter()
//         .append("rect")
//         .attr("x", (key) => x0(d.x) + x1(key))
//         .attr("y", (key) => y(d[key]))
//         .attr("width", x1.bandwidth())
//         .attr("height", (key) => height - y(d[key]))
//         .attr("fill", (key) => colorScale(key));
//     });
//   }, []);
//   return (
//     <div className="dashboard" style={{ padding: '20px' }}>
//       {/* Header Section */}
//       <Row className="mb-4">
//         <Col>
//           <h2 style={{ fontWeight: 'bold', color: '#4a90e2' }}>Sessions</h2>
//           <p style={{ color: '#6c757d' }}>Gérer les sessions efficacement</p>
//         </Col>
//       </Row>

//       {/* Stats Section */}
//       <Row className="mb-4">
//         <Col md={3}>
//           <Card className="text-center shadow-sm" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
//             <Card.Body>
//               <FaGraduationCap size={40} color="#4a90e2" />
//               <h5 style={{ marginTop: '10px', color: '#333' }}>Exams</h5>
//               <h2 style={{ fontWeight: 'bold', color: '#4a90e2' }}>7</h2>
//               <p style={{ color: '#6c757d' }}>Nombre total d'examens du dernier session</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
//             <Card.Body>
//               <FaUserTie size={40} color="#28a745" />
//               <h5 style={{ marginTop: '10px', color: '#333' }}>Enseignants</h5>
//               <h2 style={{ fontWeight: 'bold', color: '#28a745' }}>268</h2>
//               <p style={{ color: '#6c757d' }}>Nombre total d'enseignants dans la faculté</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
//             <Card.Body>
//               <FaBuilding size={40} color="#ffc107" />
//               <h5 style={{ marginTop: '10px', color: '#333' }}>Départements</h5>
//               <h2 style={{ fontWeight: 'bold', color: '#ffc107' }}>7</h2>
//               <p style={{ color: '#6c757d' }}>+19% par rapport au mois dernier</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
//             <Card.Body>
//               <FaEye size={40} color="#dc3545" />
//               <h5 style={{ marginTop: '10px', color: '#333' }}>Surveillance actuelle</h5>
//               <h2 style={{ fontWeight: 'bold', color: '#dc3545' }}>0.22</h2>
//               <p style={{ color: '#6c757d' }}>Moyenne de surveillance par enseignant</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Graphique et examens récents */}
      
//       <Row>
//         <Col md={8}>
//           <Card className="shadow-sm" style={{ border: "none" }}>
//             <Card.Body>
//               <h5 style={{ color: "#333" }}>Aperçu</h5>
//               <div
//       id="grouped-column-chart"
//       style={{
//         height: "250px",
//         borderRadius: "8px",
//         backgroundColor: "#f8f9fa",
//       }}
//     ></div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-sm" style={{ border: "none" }}>
//             <Card.Body>
//               <h5 style={{ color: "#333" }}>Exams récents</h5>
//               <ul style={{ paddingLeft: "20px", color: "#6c757d" }}>
//                 <li>Cultures et arts</li>
//                 <li>Langues étrangères</li>
//                 <li>Mathématiques pour la chimie</li>
//                 <li>Mécanique quantique</li>
//                 <li>Chimie descriptive</li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default DashDefault;
