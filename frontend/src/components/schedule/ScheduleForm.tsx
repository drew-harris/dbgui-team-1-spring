import React, { useState } from "react";
import { useDoctorSchedule } from "../../hooks/useDoctorSchedule";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const ScheduleForm: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { schedule, isLoading, error, updateSchedule } = useDoctorSchedule(
    user.id
  );

  const [start, setStart] = useState(schedule?.start || 0);
  const [end, setEnd] = useState(schedule?.end || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchedule({ start, end });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="start" className="block text-sm font-medium">
          Start Time
        </label>
        <input
          id="start"
          type="number"
          value={start}
          onChange={(e) => setStart(parseInt(e.target.value))}
          min="0"
          max="23"
          className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
        />
      </div>

      <div>
        <label htmlFor="end" className="block text-sm font-medium">
          End Time
        </label>
        <input
          id="end"
          type="number"
          value={end}
          onChange={(e) => setEnd(parseInt(e.target.value))}
          min="0"
          max="23"
          className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded bg-indigo-500 py-2 text-white"
      >
        Update Schedule
      </button>
    </form>
  );
};

export default ScheduleForm;
