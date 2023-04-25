import React from "react";
import NavBar from "../../components/all/NavBar";
import { useParams } from "react-router-dom";

const EditAppointmentPage: React.FC = () => {
  const { id: appointmentId } = useParams<{ id: string }>();

  console.log(appointmentId);
  return (
    <>
      <NavBar />
      <div className="container mx-auto p-8">
        <h1 className="mb-4 text-2xl">Edit Appointment</h1>
      </div>
    </>
  );
};

export default EditAppointmentPage;
