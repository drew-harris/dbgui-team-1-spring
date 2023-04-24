// src/components/AddAppointmentForm.tsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

interface AddAppointmentFormProps {
  onSubmit: (appointmentData: {
    time: Date;
    reason: string;
    patientId: string;
    doctorId: string;
  }) => void;
  initialDateTime?: Date;
}

const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({
  onSubmit,
  initialDateTime,
}) => {
  const { user } = useContext(AuthContext);
  const doctorId = user?.id;

  const [time, setTime] = useState(
    initialDateTime ? initialDateTime.toISOString().slice(0, 16) : ""
  );
  const [reason, setReason] = useState("");
  const [patientId, setPatientId] = useState("");

  const roundToHour = (date: Date) => {
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = moment(e.target.value).toDate();
    const roundedDate = roundToHour(date);
    setTime(roundedDate.toISOString().slice(0, 16));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!time || !reason || !patientId || !doctorId) {
      return;
    }

    const roundedDate = roundToHour(new Date(time));

    onSubmit({
      time: roundedDate,
      reason,
      patientId,
      doctorId,
    });

    setTime("");
    setReason("");
    setPatientId("");
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
        <label htmlFor="patientId" className="block text-sm font-medium">
          Patient ID
        </label>
        <input
          id="patientId"
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded bg-indigo-600 p-2 text-white hover:bg-indigo-700"
      >
        Add Appointment
      </button>
    </form>
  );
};

export default AddAppointmentForm;
