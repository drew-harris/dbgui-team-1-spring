/* eslint-disable no-unused-vars */
import {
    Container, Paper, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "../../components/nav/PatientNavBar";
import { API_URL } from "../../utils/url";


const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL + "/prescriptions", {
        headers: {
          authorization: localStorage.getItem("jwt"),
        },
      });
      setPrescriptions(response.data);
      console.log(response.data);

    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <>
      <NavBar />
      <Container>
        <Typography variant="h4" pt={3} component="h1" gutterBottom>
          My Prescriptions
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Medication</TableCell>
                <TableCell>Dosage</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.frequency}</TableCell>
                  <TableCell>{prescription.duration}</TableCell>
                </TableRow>
))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default PatientPrescriptions;
