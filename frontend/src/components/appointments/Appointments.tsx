import React, { useContext } from "react";
import { useAppointments } from "../../hooks/useAppointments";
import { AppointmentTable } from "./AppointmentTable";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";

export const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { appointments, isLoading, error, refetch } = useAppointments(user.id);

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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-semibold">Appointments</h1>
        <div className="mb-6 text-center text-2xl">
          No appointments created. Go to schedule to schedule a new appointment!
        </div>
        <button
          onClick={() => navigate("/doctor/appointments/new")}
          className="rounded-md bg-indigo-500 px-6 py-2 font-bold text-white hover:bg-indigo-700"
        >
          New Appointment
        </button>
      </div>
    );
  }

  const approvedAppointments = appointments.filter(
    (appointment) => appointment.approved
  );
  const unapprovedAppointments = appointments.filter(
    (appointment) => !appointment.approved
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Appointments</h1>
        <button
          onClick={() => navigate("/doctor/appointments/new")}
          className="rounded-md bg-indigo-500 px-6 py-2 font-bold text-white hover:bg-indigo-700"
        >
          New Appointment
        </button>
      </div>
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-semibold">Approved Appointments</h2>
        <AppointmentTable appointments={approvedAppointments} />
      </div>
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Unapproved Appointments</h2>
        <AppointmentTable appointments={unapprovedAppointments} />
      </div>
    </div>
  );
};
