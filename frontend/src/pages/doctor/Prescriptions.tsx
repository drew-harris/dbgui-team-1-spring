import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import NavBar from '../../components/all/NavBar';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // Fetch prescription data here, for example, using the fetch API or Axios
    // Replace the following sample data with fetched data
    const samplePrescriptions = [
      { id: 1, patient: 'John Doe', medication: 'Ibuprofen', dosage: '200 mg', frequency: '3 times daily' },
      { id: 2, patient: 'Jane Smith', medication: 'Amoxicillin', dosage: '500 mg', frequency: '2 times daily' },
      // Add more sample prescriptions if needed
    ];

    setPrescriptions(samplePrescriptions);
  }, []);

  return (
    <>
    <NavBar/>
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        My Prescriptions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Medication</TableCell>
              <TableCell>Dosage</TableCell>
              <TableCell>Frequency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell>{prescription.id}</TableCell>
                <TableCell>{prescription.patient}</TableCell>
                <TableCell>{prescription.medication}</TableCell>
                <TableCell>{prescription.dosage}</TableCell>
                <TableCell>{prescription.frequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </>
  );
};

export default DoctorPrescriptions;
