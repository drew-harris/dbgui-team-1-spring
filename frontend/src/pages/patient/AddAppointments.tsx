import React, { useContext } from "react";
import NavBar from "../../components/nav/PatientNavBar";
import { AuthContext } from "../../context/AuthContext";
import { usePatientAppointments } from "../../hooks/usePatientAppointments";
import PatientAddAppointmentForm from "../../components/appointments/PatientAddAppointmentForm";
import { usePatients } from "../../hooks/usePatient";

const AddAppointment: React.FC = () => {
  const { user } = useContext(AuthContext);
  const patientId = user?.id;
  const { patient } = usePatients(patientId);
  const { addAppointment } = usePatientAppointments(patientId);

  const doctorId = patient?.doctorId;

  const handleAddAppointment = (appointmentData: {
    time: Date;
    reason: string;
    patientId: string;
    doctorId: string;
  }) => {
    addAppointment({
      time: appointmentData.time,
      reason: appointmentData.reason,
      patientId: appointmentData.patientId,
      doctorId: appointmentData.doctorId,
      isPlaceholder: false,
      status: "Pending",
    });
  };

  if (!doctorId) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto p-8">
          <h1 className="mb-4 text-3xl font-semibold">Add Appointment</h1>
          <p>Could not find the doctor for the patient.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-8">
        <h1 className="mb-4 text-3xl font-semibold">Add Appointment</h1>
        <p className="mb-4">Add an appointment for your doctor to approve.</p>
        <PatientAddAppointmentForm
          onSubmit={handleAddAppointment}
          patientId={patientId}
          doctorId={doctorId}
        />
      </div>
    </>
  );
};

export default AddAppointment;
