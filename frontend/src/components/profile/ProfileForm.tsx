import React from "react";
import { DoctorData } from "../../hooks/useDoctor";

interface ProfileFormProps {
  doctor: DoctorData;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ doctor }) => {
  const { email, username, firstName, lastName, location, practice } = doctor;

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 text-2xl font-bold">Doctor Profile</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled
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
            value={username}
            disabled
            className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            disabled
            className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            disabled
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
            value={location}
            disabled
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
            value={practice}
            disabled
            className="block w-full rounded border border-gray-300 p-2 focus:border-indigo-300 focus:outline-none focus:ring"
          />
        </div>

        <button
          type="button"
          disabled
          className="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
