import React, { useState, useContext } from "react";
import { useAppointments, AppointmentData } from "../../hooks/useAppointments";
import { useDoctorSchedule } from "../../hooks/useDoctorSchedule";
import NavBar from "../../components/nav/DoctorNavBar";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { ScheduleTable } from "../../components/schedule/ScheduleTable"; // Import the ScheduleTable component

interface PlaceholderAppointment {
  id: number;
  time: Date;
  patient: {
    firstName: string;
    lastName: string;
  };
  reason: string;
  approved: boolean;
  isPlaceholder: true;
  status: "Empty";
}

type CombinedAppointment = AppointmentData | PlaceholderAppointment;

function Schedule() {
  const { user } = useContext(AuthContext);
  const {
    appointments,
    isLoading,
    error,
    //refetch,
    cancelAppointment,
    approveAppointment,
    rejectAppointment,
  } = useAppointments(user.id);

  // Fetch the doctor's schedule
  const { schedule: doctorSchedule } = useDoctorSchedule(user.id);

  const [selectedDay, setSelectedDay] = useState(
    moment("2023-03-25").startOf("day")
  );

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDay(moment(event.target.value).startOf("day"));
  };
  const navigate = useNavigate();

  const generateTimeSlots = (startHour: number, endHour: number) => {
    const slots = [];
    for (let i = startHour; i <= endHour; i++) {
      slots.push(moment(selectedDay).hour(i).minute(0));
    }
    return slots;
  };

  // Use doctorSchedule.start and doctorSchedule.end if available, otherwise, use default values
  const timeSlots = generateTimeSlots(
    doctorSchedule?.start || 9,
    doctorSchedule?.end || 17
  );

  const filteredAppointments = appointments?.filter((appointment) =>
    moment(appointment.time).isSame(selectedDay, "day")
  );

  const combinedAppointments: CombinedAppointment[][] = timeSlots.map(
    (slot) => {
      const existingAppointments = filteredAppointments?.filter((appointment) =>
        moment(appointment.time).isSame(slot, "minute")
      );

      return existingAppointments?.length
        ? existingAppointments.map((appointment) => ({
            ...appointment,
            status: appointment.approved
              ? "Approved"
              : appointment.isPlaceholder
              ? "Empty"
              : "Pending",
          }))
        : [
            {
              id: slot.valueOf(),
              time: slot.toDate(),
              patient: { firstName: "", lastName: "" },
              reason: "",
              approved: false,
              isPlaceholder: true,
              status: "Empty",
            },
          ];
    }
  );

  const handleScheduleClick = (time: Date) => {
    navigate(`/doctor/appointments/new?dateTime=${time.toISOString()}`);
  };

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
          <button
            onClick={() => navigate("/doctor/schedule/change")}
            className="rounded-md bg-indigo-500 px-6 py-2 font-bold text-white hover:bg-indigo-700"
          >
            Change Schedule
          </button>
        </div>
        <div className="mb-4">
          <label className="mr-2 font-medium">Select Day:</label>
          <input
            type="date"
            onChange={handleDayChange}
            className="rounded border border-gray-300 px-2 py-1"
          />
        </div>
        <div className="container mx-auto">
          <ScheduleTable
            combinedAppointments={combinedAppointments}
            handleScheduleClick={handleScheduleClick}
            cancelAppointment={cancelAppointment}
            approveAppointment={approveAppointment}
            rejectAppointment={rejectAppointment}
          />
        </div>
      </div>
    </>
  );
}

export default Schedule;
