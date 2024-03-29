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
import NavBar from "../../components/nav/DoctorNavBar";
import { API_URL } from "../../utils/url";


const DoctorPrescriptions = () => {
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


  const handleSave = () => {
    const newPrescription = {
    "patientId": selectedPatient,
    "medication" : medication,
    "dosage" : dosage,
    "frequency" : frequency,
    "duration" : duration,
    "comment" : comment
    }
    makeNewPrescription(newPrescription);
    setRefresh(refresh + 1);
    handleClose();
  };

  const handleClose = () => {
    setMedication('');
    setDuration('');
    setDosage('');
    setFrequency('');
    setComment('');
    setDialogOpen(false);
  };

  const approvePrescriptions = async (prescriptionId, action) => {
    try {
      const headers = {authorization: localStorage.getItem("jwt")};
      const body = {};
      const response = await axios.put(`${API_URL}/prescriptions/${prescriptionId}/refill/${action}`,body, {headers});
      console.log(response);

    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const declinePrescriptions = async (prescriptionId) => {
    try {
      const headers = {authorization: localStorage.getItem("jwt")};
      const body = {};
      const response = await axios.delete(`${API_URL}/prescriptions/${prescriptionId}`, {headers});
      console.log(response);

    } catch (error) {
      console.error("Error deleting prescriptions:", error);
    }
  }

  const makeNewRequest = async (prescriptionid) => {
    const headers = {authorization: localStorage.getItem("jwt")};
    const body = {};
      try {
        axios.post(`${API_URL}/prescriptions/${prescriptionid}/refill`, 
        body,
        {headers}
        );
      }
      catch (error) {
        console.error("error fetching request", error);
      }
  };

  const makeNewPrescription = async (prescription) => {
    const headers = {authorization: localStorage.getItem("jwt")};
    try {
      const response = await axios.post(API_URL + "/prescriptions",
        prescription,
        { headers }
      );
      const id_to_add = response.data.id;
      console.log(response);
      makeNewRequest(id_to_add);


    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(API_URL + "/patients", {
        headers: {
          authorization: localStorage.getItem("jwt"),
        },
      });
      console.log("PATIENTS::::::::::");
      console.log(response.data);
      setAllPatients(response.data);

    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  // load the patient data
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL + "/prescriptions/doctor", {
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
    var temp = [...prescriptions];

    var newTemp = []
    for (let i = 0; i < temp.length; i++) {
      if (prescriptions[i].refills.length == 0) {
        newTemp.push(prescriptions[i]);
      }
      else if (prescriptions[i].refills[prescriptions[i].refills.length - 1].approved == false) {
        newTemp.push(prescriptions[i]);
      }
    }

    console.log("TEMP+++++++");
    console.log(newTemp);

    setFilteredPrescriptions(newTemp);
  }, [prescriptions]);

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    var new_options = [];

    for (let i = 0; i < allPatients.length; ++i) {
      new_options.push({
        value: allPatients[i].id,
        label: allPatients[i].firstName + " " + allPatients[i].lastName
      })
    }

    setOptions(new_options);
  }, [allPatients]);

  return (
    <>
      <Dialog open={dialogOpen} onClose={handleClose}>
      <DialogTitle>Add Prescription</DialogTitle>
      <DialogContent>
        <InputLabel id="select-label">Select a Patient</InputLabel>
        <Select
          labelId="select-label"
          value={selectedPatient}
          onChange={(event) => {
            setSelectedPatient(event.target.value)
          }}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        <TextField label="Medication" value={medication} onChange={e => setMedication(e.target.value)} fullWidth margin="normal" />
        <TextField label="Duration" value={duration} onChange={e => setDuration(e.target.value)} fullWidth margin="normal" />
        <TextField label="Dosage" value={dosage} onChange={e => setDosage(e.target.value)} fullWidth margin="normal" />
        <TextField label="Frequency" value={frequency} onChange={e => setFrequency(e.target.value)} fullWidth margin="normal" />
        <TextField label="Comment" value={comment} onChange={e => setComment(e.target.value)} fullWidth margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
      <NavBar />
      <Container>
        <Typography variant="h4" pt={3} component="h1" gutterBottom>
          My Prescriptions
        </Typography>
        <button
          onClick={() => setDialogOpen(true)}
          className="rounded-md mb-4 bg-indigo-500 px-6 py-2 font-bold text-white hover:bg-indigo-700"
        >
          New Prescription
        </button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Medication</TableCell>
                <TableCell>Dosage</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>{prescription.patient.firstName}</TableCell>
                  <TableCell>{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.frequency}</TableCell>
                  <TableCell>{prescription.duration}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        approvePrescriptions(prescription.refills[prescription.refills.length - 1].id, "accept");
                      }}
                      className="mr-2 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700">
                      Approve
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                        onClick={() => {
                        // declinePrescriptions(prescription.id);
                        approvePrescriptions(prescription.refills[prescription.refills.length - 1].id, "accept");
                      }}
                      className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
                      Reject
                    </button>
                  </TableCell>
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
