import React, { useContext } from "react";
import PatientAppointmentTable from "../../components/appointments/PatientAppointmentTable";
import { AuthContext } from "../../context/AuthContext";
import { usePatientAppointments } from "../../hooks/usePatientAppointments";
import { CircularProgress } from "@mui/material";
import NavBar from "../../components/nav/PatientNavBar";

export const PatientAppointments: React.FC = () => {
  const { user } = useContext(AuthContext);

  const { appointments, isLoading, error, refetch } = usePatientAppointments(
    user.id
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress color="secondary" />
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>There was an error fetching appointments.</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return <div>No appointments found.</div>;
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Appointments</h1>
        </div>
        <div>
          <PatientAppointmentTable appointments={appointments} />
        </div>
      </div>
    </>
  );
};

export default PatientAppointments;