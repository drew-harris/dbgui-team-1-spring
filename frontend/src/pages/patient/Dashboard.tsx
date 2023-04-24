/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Grid, Avatar, Badge } from "@mui/material";
import { Notifications } from "@mui/icons-material";

export default function Dashboard() {
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchPatient = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:8000/patient/`);
  //       const data = await response.json();
  //       setPatient(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchPatient();
  // }, []);

  const handleLogout = () => {
    navigate("/");
  }

  const handlePrescription = () => {
    navigate("/")
  }

  const handleAppointment = () => {
    navigate("/")
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <Avatar alt="Patient Avatar" src={patient?.avatar} sx={{ mr: 2 }} />
            <Typography variant="h6">{patient?.firstName} {patient?.lastName}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Badge badgeContent={4} color="secondary">
              <Notifications />
            </Badge>
            <Button variant="outlined" sx={{ ml: 2 }} onClick={handleLogout}>
              Logout
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={16}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Upcoming Appointments</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">No upcoming appointments.</Typography>
            </Box>
            <Button variant="contained" onClick={handleAppointment}>
              Make Appointment
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6"> Prescriptions </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">No prescriptions</Typography>
            </Box>
            <Button variant="contained" onClick={handlePrescription}>
              Request Refill
            </Button>
          </Paper>
        </Grid>
      </Box>
    </div>
  );
}
