import React from "react";
import { useAppointments } from "../../hooks/useAppointments";
import { AppointmentTable } from "./AppointmentTable";
import { useNavigate } from "react-router-dom";

export const Appointments: React.FC = () => {
  const { appointments, isLoading, error, refetch } = useAppointments();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
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
          onClick={() => navigate("/doctor/schedule")}
          className="rounded-md bg-blue-500 px-6 py-2 font-bold text-white hover:bg-blue-700"
        >
          Post & View Schedule
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
