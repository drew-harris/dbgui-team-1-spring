import React, { useState, useContext } from "react";
import { usePatientAppointments } from "../../hooks/usePatientAppointments";
import NavBar from "../../components/nav/PatientNavBar";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { PatientScheduleTable } from "../../components/schedule/PatientScheduleTable";
import { AuthContext } from "../../context/AuthContext";

function PatientSchedule() {
  const { user } = useContext(AuthContext);
  const { appointments, isLoading, error, cancelAppointment } =
    usePatientAppointments(user.id);
  const [selectedDay, setSelectedDay] = useState(
    moment("2023-03-25").startOf("day")
  );

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDay(moment(event.target.value).startOf("day"));
  };

  const filteredAppointments = appointments?.filter((appointment) =>
    moment(appointment.time).isSame(selectedDay, "day")
  );

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
          <CircularProgress color="secondary" />
        </div>
      </>
    );
  }
  if (error) return <p>Error loading appointments</p>;

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Schedule</h1>
        </div>
        <p className="mb-4 text-base">
          This is your current schedule with your doctor for the selected day.
        </p>
        <div className="mb-4">
          <label className="mr-2 font-medium">Select Day:</label>
          <input
            type="date"
            onChange={handleDayChange}
            className="rounded border border-gray-300 px-2 py-1"
          />
        </div>
        <div className="container mx-auto">
          <PatientScheduleTable
            appointments={filteredAppointments}
            cancelAppointment={cancelAppointment}
          />
        </div>
      </div>
    </>
  );
}

export default PatientSchedule;
