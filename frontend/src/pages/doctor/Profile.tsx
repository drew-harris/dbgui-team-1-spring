import NavBar from "../../components/nav/DoctorNavBar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useDoctor } from "../../hooks/useDoctor";
import ProfileForm from "../../components/profile/ProfileForm";
import { CircularProgress } from "@mui/material";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const { doctor, isLoading, updateDoctor } = useDoctor(user.id);

  return (
    <>
      <NavBar />
      <div className="container mx-auto">
        {isLoading ? (
          <div className="flex min-h-screen items-center justify-center">
            <CircularProgress color="secondary" />
          </div>
        ) : (
          doctor && <ProfileForm doctor={doctor} updateDoctor={updateDoctor} />
        )}
      </div>
    </>
  );
}
