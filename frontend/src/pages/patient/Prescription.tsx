/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import NavBar from "../../components/nav/PatientNavBar";
import { API_URL } from "../../utils/url";


const PatientPrescriptions = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [medication, setMedication] = useState('');
  const [duration, setDuration] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [comment, setComment] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);




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
        <Typography variant="h4" component="h1" gutterBottom>
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
