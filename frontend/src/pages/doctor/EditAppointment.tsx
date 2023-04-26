import React, { useEffect, useState } from "react";
import NavBar from "../../components/nav/DoctorNavBar";
import { useParams } from "react-router-dom";
import EditAppointmentForm from "../../components/appointments/EditAppointmentForm";
import { useAppointments } from "../../hooks/useAppointments";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const EditAppointmentPage: React.FC = () => {
  const { id: appointmentId } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState(null);
  const { user } = useContext(AuthContext);

  const {
    appointments,
    refetch,
    updateAppointment: updateAppointmentMutation,
  } = useAppointments(user.id);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      await refetch();
      const appointmentData = appointments.find(
        (appointment) => appointment.id === appointmentId
      );
      setAppointment(appointmentData);
    };

    fetchAppointmentData();
  }, [appointmentId, appointments, refetch]);

  const handleFormSubmit = async (updatedAppointmentData) => {
    await updateAppointmentMutation({
      appointmentId,
      appointmentData: updatedAppointmentData,
    });
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-8">
        <h1 className="mb-4 text-2xl">Edit Appointment</h1>
        {appointment && (
          <EditAppointmentForm
            onSubmit={handleFormSubmit}
            initialData={{
              time: new Date(appointment.time),
              reason: appointment.reason,
              patientId: appointment.patientId,
              approved: appointment.approved,
            }}
          />
        )}
      </div>
    </>
  );
};

export default EditAppointmentPage;
