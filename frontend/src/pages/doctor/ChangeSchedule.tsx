import React from "react";
import ScheduleForm from "../../components/schedule/ScheduleForm";
import NavBar from "../../components/all/NavBar";

const DoctorSchedulePage: React.FC = () => {
  // Replace "doctorId" with the actual doctor's ID
  const doctorId = "doctorId";

  return (
    <>
      <NavBar />
      <div className="container mx-auto">
        <h1 className="mb-6 text-2xl font-semibold">Update Schedule</h1>
        <ScheduleForm doctorId={doctorId} />
      </div>
    </>
  );
};

export default DoctorSchedulePage;
