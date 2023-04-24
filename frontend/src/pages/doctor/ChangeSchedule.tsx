import React from "react";
import ScheduleForm from "../../components/schedule/ScheduleForm";
import NavBar from "../../components/all/NavBar";

const DoctorSchedulePage: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="container mx-auto p-8">
        <h1 className="mb-6 text-2xl font-semibold">Update Schedule</h1>
        <p className="mb-6">
          Update your schedule so patients can book appointments with you, will
          be rounded down to hour.
        </p>
        <ScheduleForm />
      </div>
    </>
  );
};

export default DoctorSchedulePage;
