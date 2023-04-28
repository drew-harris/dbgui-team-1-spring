import React, { useState } from "react";
import { PatientData } from "../../hooks/usePatient";
import { useDoctor } from "../../hooks/useDoctor";

interface PatientProfileFormProps {
  patient: PatientData;
  // eslint-disable-next-line no-unused-vars
  updatePatient: (updatedPatientData: Partial<PatientData>) => void;
}

const PatientProfileForm: React.FC<PatientProfileFormProps> = ({
  patient,
  updatePatient,
}) => {
  const { doctor } = useDoctor(patient.doctorId);
  const [formData, setFormData] = useState<Partial<PatientData>>(patient);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatePatient(formData);
  };



  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-2 text-2xl font-bold">Patient Profile</h1>
      <div className="mb-4 flex items-center justify-between">
        {doctor && (
          <h2 className="text-xl font-semibold">
            Current Doctor:{" "}
            <span className="font-normal">
              {doctor.firstName} {doctor.lastName}
            </span>
          </h2>
        )}
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="lastName" className="block text-sm font-medium">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default PatientProfileForm;
