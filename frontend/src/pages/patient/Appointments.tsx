import React, { useContext } from "react";
import PatientAppointmentTable from "../../components/appointments/PatientAppointmentTable";
import { AuthContext } from "../../context/AuthContext";
import { usePatientAppointments } from "../../hooks/usePatientAppointments";
import { CircularProgress } from "@mui/material";
import NavBar from "../../components/nav/PatientNavBar";
import { Link } from "react-router-dom";

export const PatientAppointments: React.FC = () => {
  const { user } = useContext(AuthContext);

  const { appointments, isLoading, error, refetch } = usePatientAppointments(
    user.id
  );

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <CircularProgress color="secondary" />
        </div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <NavBar />
        <div>
          <p>There was an error fetching appointments.</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      </>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <>
        <NavBar />
        <div>No appointments found.</div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Appointments</h1>
          <Link to="/patient/appointments/new">
            <button className="rounded-md bg-indigo-500 px-6 py-2 font-bold text-white hover:bg-indigo-700">
              New Appointment
            </button>
          </Link>
        </div>
        <div>
          <PatientAppointmentTable appointments={appointments} />
        </div>
      </div>
    </>
  );
};

export default PatientAppointments;
