import React, { useState } from "react";
import { DoctorData } from "../../hooks/useDoctor";

interface ProfileFormProps {
  doctor: DoctorData;
  // eslint-disable-next-line no-unused-vars
  updateDoctor: (updatedDoctorData: Partial<DoctorData>) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ doctor, updateDoctor }) => {
  const [formData, setFormData] = useState<Partial<DoctorData>>(doctor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateDoctor(formData);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 text-2xl font-bold">Doctor Profile</h1>
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

        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label htmlFor="practice" className="block text-sm font-medium">
            Practice
          </label>
          <input
            id="practice"
            type="text"
            value={formData.practice}
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

export default ProfileForm;
