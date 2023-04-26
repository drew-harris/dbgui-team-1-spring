import React from "react";
import moment from "moment";
import { AppointmentData } from "../../hooks/useAppointments";

interface PatientScheduleTableProps {
  appointments: AppointmentData[] | undefined;
  // eslint-disable-next-line no-unused-vars
  cancelAppointment: (id: string) => void;
}

export const PatientScheduleTable: React.FC<PatientScheduleTableProps> = ({
  appointments,
  cancelAppointment,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="mx-0 min-w-full divide-y divide-gray-200 border border-blue-300">
        <thead className="bg-indigo-500">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
              Doctor
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
          {appointments?.map((appointment, index) => (
            <tr
              key={appointment.id}
              className={index % 2 === 0 ? "bg-blue-50" : ""}
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                {moment(appointment.time).format("YYYY-MM-DD")}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                {moment(appointment.time).format("hh:mm A")}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                {appointment.doctor.firstName} {appointment.doctor.lastName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                {appointment.reason}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    appointment.approved
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {appointment.approved ? "Approved" : "Pending"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                {appointment.approved ? (
                  <button
                    onClick={() => cancelAppointment(appointment.id.toString())}
                    className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-gray-500">Awaiting approval</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
