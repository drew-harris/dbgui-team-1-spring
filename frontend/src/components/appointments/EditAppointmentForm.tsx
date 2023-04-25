// src/components/EditAppointmentForm.tsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { usePatients } from "../../hooks/usePatients";

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

  const [time, setTime] = useState(initialData.time.toISOString().slice(0, 16));

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

      <div>
        <label htmlFor="approved" className="block text-sm font-medium">
          Approved
        </label>
        <input
          id="approved"
          type="checkbox"
          checked={approved}
          onChange={(e) => setApproved(e.target.checked)}
          className="ml-4 block rounded border border-gray-300 focus:border-indigo-300 focus:outline-none focus:ring"
        />
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
