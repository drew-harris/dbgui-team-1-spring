import React, { useState } from "react";
import { AppointmentData } from "../../hooks/useAppointments";
import CancelAppointmentModal from "./CancelAppointmentModal";
// import { useNavigate } from "react-router-dom";

interface PatientAppointmentTableProps {
  appointments: AppointmentData[];
}

const PatientAppointmentTable: React.FC<PatientAppointmentTableProps> = ({
  appointments,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);

  //   const navigate = useNavigate();

  const openCancelModal = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  return (
    <div className="mx-auto w-full">
      {openModal && selectedAppointment && (
        <CancelAppointmentModal
          open={openModal}
          setOpen={setOpenModal}
          appointment={selectedAppointment}
        />
      )}
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
                Approved
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {appointments.map((appointment, index) => {
              const appointmentDate = new Date(appointment.time);
              const dateString = appointmentDate.toLocaleDateString();
              const timeString = appointmentDate.toLocaleTimeString();

              return (
                <tr
                  key={appointment.id}
                  className={index % 2 === 0 ? "bg-indigo-100" : ""}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {dateString}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {timeString}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {appointment.doctor.firstName} {appointment.doctor.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {appointment.reason}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <span
                      className={`inline-flex h-8 w-10 items-center justify-center rounded-full ${
                        appointment.approved
                          ? "bg-green-400 text-black"
                          : "bg-red-400 text-black"
                      }`}
                    >
                      {appointment.approved ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                        onClick={() => openCancelModal(appointment)}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientAppointmentTable;
