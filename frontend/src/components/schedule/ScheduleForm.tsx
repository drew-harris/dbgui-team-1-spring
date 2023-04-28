import React, { useState, useEffect } from "react";
import { useDoctorSchedule } from "../../hooks/useDoctorSchedule";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { CircularProgress } from "@mui/material";

const ScheduleForm: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { schedule, isLoading, error, updateSchedule } = useDoctorSchedule(
    user.id
  );

  const [start, setStart] = useState("00:00");
  const [end, setEnd] = useState("00:00");

  useEffect(() => {
    if (schedule) {
      setStart(
        schedule.start
          ? `${String(schedule.start).padStart(2, "0")}:00`
          : "00:00"
      );
      setEnd(
        schedule.end ? `${String(schedule.end).padStart(2, "0")}:00` : "00:00"
      );
    }
  }, [schedule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchedule({
      start: parseInt(start.split(":")[0]),
      end: parseInt(end.split(":")[0]),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress color="secondary" />
      </div>
    );
  }
  if (error) return <div><>Error: {error}</></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="start" className="block text-sm font-medium">
          Start Time
        </label>
        <input
          id="start"
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          step="3600"
          className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
        />
      </div>

      <div>
        <label htmlFor="end" className="block text-sm font-medium">
          End Time
        </label>
        <input
          id="end"
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          step="3600"
          className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded bg-indigo-500 py-2 text-white"
      >
        {" "}
        Update Schedule{" "}
      </button>
    </form>
  );
};

export default ScheduleForm;
