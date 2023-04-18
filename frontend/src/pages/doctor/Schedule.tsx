import React, { useState } from "react";
import { useAppointments, AppointmentData } from "../../hooks/useAppointments";
import NavBar from "../../components/all/NavBar";
import moment from "moment";

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
  const {
    appointments,
    isLoading,
    error,
    refetch,
    createAppointment,
    cancelAppointment,
    approveAppointment,
    rejectAppointment,
  } = useAppointments();

  const [selectedDay, setSelectedDay] = useState(moment().startOf("day"));

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDay(moment(event.target.value).startOf("day"));
  };

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
        ? existingAppointments
        : [
            {
              id: slot.valueOf(),
              time: slot.toDate(),
              patient: { firstName: "", lastName: "" },
              reason: "",
              approved: false,
              isPlaceholder: true,
            },
          ];
    }
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading appointments</p>;

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-4">
        <h1 className="my-4 text-3xl font-semibold">Doctor Schedule</h1>
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
            <thead className="bg-blue-500">
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
                        index % 2 === 0 && subIndex === 0 ? "bg-blue-100" : ""
                      }
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {subIndex === 0 &&
                          moment(appointment.time).format("HH:mm")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {appointment.patient.firstName}{" "}
                        {appointment.patient.lastName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {appointment.reason}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {appointment.approved ? "Approved" : "Pending"}
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
                            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
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
