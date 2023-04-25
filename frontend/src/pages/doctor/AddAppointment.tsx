import React, { useContext } from "react";
import NavBar from "../../components/nav/DoctorNavBar";
import { useAppointments } from "../../hooks/useAppointments";
import { AuthContext } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import AddAppointmentForm from "../../components/appointments/AddAppointmentForm";

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { createAppointment } = useAppointments(user.id);
  const [searchParams] = useSearchParams();
  const initialDateTime = searchParams.get("dateTime")
    ? new Date(searchParams.get("dateTime") as string)
    : undefined;

  const handleAddAppointment = (appointmentData: {
    time: Date;
    reason: string;
    patientId: string;
    doctorId: string;
  }) => {
    createAppointment({
      ...appointmentData,
      isPlaceholder: false,
      status: "Pending",
    });
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-8">
        <h1 className="mb-4 text-2xl">Add Appointment</h1>
        <AddAppointmentForm
          onSubmit={handleAddAppointment}
          initialDateTime={initialDateTime}
        />
      </div>
    </>
  );
};

export default App;
