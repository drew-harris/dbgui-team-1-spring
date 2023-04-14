import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

export default function ChooseDoctor() {
  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `https://api.example.com/doctors?name=${searchTerm}`
    );
    const data = await response.json();
    if (data.length === 1) {
      const doctorId = data[0].id;
      localStorage.setItem("doctorId", doctorId);
      navigate("/doctor/dashboard");
    } else if (data.length === 0) {
      setError("Doctor not found. Please try again.");
    } else {
      setSelectedDoctor(data);
    }
  };
  return (
    <div className="items center flex min-h-screen justify-center bg-blue-200">
      <div className="w-full max-w-md rounded-lg border border-blue-300 bg-white">
        <div className="m-6">
          <h1 className="text-2x1 mb-4 font-bold">Choose a Doctor</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search for doctor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          {error && <p>{error}</p>}
          <div className="mb-4">
            {selectedDoctor.length > 0 && (
              <ul>
                {selectedDoctor.map((doctor) => (
                  <li key={doctor.id}>{doctor.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
