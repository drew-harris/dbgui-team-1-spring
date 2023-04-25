import React from "react";
import moment from "moment";
import { AppointmentData } from "../../hooks/useAppointments";

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

interface ScheduleTableProps {
  combinedAppointments: CombinedAppointment[][];
  // eslint-disable-next-line no-unused-vars
  handleScheduleClick: (time: Date) => void;
  // eslint-disable-next-line no-unused-vars
  cancelAppointment: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  approveAppointment: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  rejectAppointment: (id: string) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  combinedAppointments,
  handleScheduleClick,
  cancelAppointment,
  approveAppointment,
  rejectAppointment,
}) => {
  return (
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
                        onClick={() => handleScheduleClick(appointment.time)}
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
  );
};
