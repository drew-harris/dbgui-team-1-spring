import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DoctorRoute from "./router/DoctorRoute";
import PatientRoute from "./router/PatientRoute";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorDiscussion from "./pages/doctor/Discussions";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorAppointment from "./pages/doctor/Appointment";
import DoctorSchedule from "./pages/doctor/Schedule";

import PatientDashboard from "./pages/patient/Dashboard";
import ChooseDoctor from "./pages/patient/ChooseDoctor";

import { AuthContext } from "./context/AuthContext";

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { user, updateToken } = useContext(AuthContext);

  useEffect(() => {
    const checkJwt = async () => {
      const jwt = window.localStorage.getItem("jwt");
      if (jwt) {
        await updateToken(jwt);
      }
      setLoading(false);
    };

    checkJwt();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "jwt") {
        checkJwt();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [updateToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isLoggedIn = user !== null;
  const type = user?.type || "";

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route element={<DoctorRoute isLoggedIn={isLoggedIn} type={type} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/discussions" element={<DoctorDiscussion />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/schedule" element={<DoctorSchedule />} />
          <Route
            path="/doctor/appointments/:id"
            element={<DoctorAppointment />}
          />
        </Route>
        <Route element={<PatientRoute isLoggedIn={isLoggedIn} type={type} />}>
          <Route path="/patient/doctors" element={<ChooseDoctor />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
        </Route>
        <Route path="*" element={<div>404 page not found</div>} />
      </Routes>
    </>
  );
};

export default App;
