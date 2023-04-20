import React, { useState, useContext } from "react";
import { useAppointments, AppointmentData } from "../../hooks/useAppointments";
import NavBar from "../../components/all/NavBar";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

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
}

type CombinedAppointment = AppointmentData | PlaceholderAppointment;

function Schedule() {
  const { user } = useContext(AuthContext);
  const {
    appointments,
    isLoading,
    error,
    //refetch,
    createAppointment,
    cancelAppointment,
    approveAppointment,
    rejectAppointment,
  } = useAppointments(user.id);

  const [selectedDay, setSelectedDay] = useState(moment().startOf("day"));

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

  const filteredAppointments = appointments?.filter((appointment) =>
    moment(appointment.time).isSame(selectedDay, "day")
  );

  const timeSlots = generateTimeSlots(9, 17);

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading appointments</p>;

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Schedule</h1>
          <button
            onClick={() => navigate("/doctor/appointments/new")}
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
        <div className="overflow-x-auto">
          <table className="mx-0 min-w-full divide-y divide-gray-200 border border-blue-300">
            <thead className="bg-indigo-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {combinedAppointments.map((appointments, index) => (
                <>
                  {appointments.map((appointment, subIndex) => (
                    <tr
                      key={appointment.id}
                      className={
                        index % 2 === 0 && subIndex === 0 ? "bg-blue-50" : ""
                      }
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {subIndex === 0 &&
                          moment(appointment.time).format("hh:mm A")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {appointment.patient.firstName}{" "}
                        {appointment.patient.lastName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {appointment.reason}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            appointment.status === "Approved"
                              ? "bg-green-200 text-green-800"
                              : appointment.status === "Empty"
                              ? "bg-gray-200 text-gray-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {appointment.isPlaceholder ? (
                          <button
                            onClick={() =>
                              createAppointment({
                                time: moment(appointment.time).toDate(),
                                reason: "Your reason here", // You need to provide a reason or get it from the user input
                                patientId: "Your patient ID here", // You need to provide a patient ID
                                doctorId: "Your doctor ID here", // You need to provide a doctor ID
                                isPlaceholder: false,
                              })
                            }
                            className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                          >
                            Schedule
                          </button>
                        ) : appointment.approved ? (
                          <button
                            onClick={() =>
                              cancelAppointment(appointment.id.toString())
                            }
                            className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                approveAppointment(appointment.id.toString())
                              }
                              className="mr-2 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                rejectAppointment(appointment.id.toString())
                              }
                              className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Schedule;
