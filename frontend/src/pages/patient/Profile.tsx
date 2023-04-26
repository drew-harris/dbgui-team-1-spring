// src/pages/userProfile.tsx
import NavBar from "../../components/nav/PatientNavBar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { usePatients } from "../../hooks/usePatient";
import PatientProfileForm from "../../components/profile/PatientProfileForm";
import { CircularProgress } from "@mui/material";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const { patient, isLoading, updatePatient } = usePatients(user.id);

  return (
    <>
      <NavBar />
      <div className="container mx-auto">
        {isLoading ? (
          <div className="flex min-h-screen items-center justify-center">
            <CircularProgress color="secondary" />
          </div>
        ) : (
          patient && (
            <PatientProfileForm
              patient={patient}
              updatePatient={updatePatient}
            />
          )
        )}
      </div>
    </>
  );
}
