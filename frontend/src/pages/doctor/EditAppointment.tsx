/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function EditAppointment() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [time, setTime] = useState("");
  const [approved, setApproved] = useState(false);
  const [reason, setReason] = useState("");

  // Fetch the appointment data here and set the state variables
  // useEffect(() => {
  //   // Fetch appointment data using appointmentId
  //   // setTime(appointment.time);
  //   // setApproved(appointment.approved);
  //   // setReason(appointment.reason);
  // }, [appointmentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the updated appointment details here
  };

  const handleBack = () => {
    navigate("/doctor/appointments");
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
      <div className="relative py-3 sm:mx-auto sm:max-w-xl">
        <ArrowLeftIcon
          className="absolute left-3 top-3 h-6 w-6 cursor-pointer text-gray-400"
          onClick={handleBack}
        />
        <div className="absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
        <div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="mb-4 text-2xl font-bold">Edit Appointment</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="time"
              >
                Time
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="time"
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="approved"
              >
                Approved
              </label>
              <input
                className="mr-2 leading-tight"
                type="checkbox"
                id="approved"
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
              />
            </div>
            <div className="mb-6">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="reason"
              >
                Reason
              </label>
              <textarea
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="reason"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>
            <button
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
