// src/components/EditAppointmentForm.tsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { usePatients } from "../../hooks/usePatient";

interface EditAppointmentFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (appointmentData: {
    time: Date;
    reason: string;
    patientId: string;
    doctorId: string;
    approved: boolean;
  }) => void;
  initialData: {
    time: Date;
    reason: string;
    patientId: string;
    approved: boolean;
  };
}

const EditAppointmentForm: React.FC<EditAppointmentFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const { user } = useContext(AuthContext);
  const doctorId = user?.id;
  const { patients } = usePatients();
  const patient = patients?.find((p) => p.id === initialData.patientId);

  const [time, setTime] = useState(
    initialData.time
      ? new Date(
          initialData.time.getTime() -
            initialData.time.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16)
      : ""
  );

  const [reason, setReason] = useState(initialData.reason);
  const [approved, setApproved] = useState(initialData.approved);

  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!time || !reason || !initialData.patientId || !doctorId) {
      return;
    }

    onSubmit({
      time: new Date(time),
      reason,
      patientId: initialData.patientId,
      doctorId,
      approved,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="time" className="block text-sm font-medium">
          Time
        </label>
        <input
          id="time"
          type="datetime-local"
          value={time}
          onChange={handleChangeTime}
          className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium">
          Reason
        </label>
        <input
          id="reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
        />
      </div>

      <div className="flex items-center">
        <label htmlFor="approved" className="mr-3 block text-sm font-medium">
          Approved
        </label>
        <div className="relative">
          <input
            id="approved"
            type="checkbox"
            checked={approved}
            onChange={(e) => setApproved(e.target.checked)}
            className="hidden"
          />
          <label
            htmlFor="approved"
            className={`inline-block h-6 w-6 cursor-pointer rounded-sm border-2 border-gray-300 ${
              approved ? "bg-indigo-600" : "bg-white"
            }`}
          >
            <svg
              className={`h-5 w-5 text-white ${approved ? "block" : "hidden"}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a1 1 0 011.707-.707L9 6.586l4.647-4.648A1 1 0 0115.414 4l-5 5a1 1 0 01-1.414 0l-5-5z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Patient</label>
        <p className="block w-full rounded border border-gray-300 p-2">
          {patient?.firstName} {patient?.lastName}
        </p>
      </div>

      <button
        type="submit"
        className="w-full rounded bg-indigo-600 p-2 text-white hover:bg-indigo-700"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditAppointmentForm;
