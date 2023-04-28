/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DoctorRoute from "./router/DoctorRoute";
import PatientRoute from "./router/PatientRoute";
import { CircularProgress } from "@mui/material";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorDiscussion from "./pages/doctor/Discussions";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorAppointmentsEdit from "./pages/doctor/EditAppointment";
import DoctorSchedule from "./pages/doctor/Schedule";
import DoctorApppointmentsAdd from "./pages/doctor/AddAppointment";
import DoctorScheduleChange from "./pages/doctor/ChangeSchedule";
import DoctorProfile from "./pages/doctor/Profile";

import PatientDashboard from "./pages/patient/Dashboard";
import ChooseDoctor from "./pages/patient/ChooseDoctor";
import PatientAppointments from "./pages/patient/Appointments";
import PatientProfile from "./pages/patient/Profile";
import PatientSchedule from "./pages/patient/Schedule";
import PatientAppointmentsAdd from "./pages/patient/AddAppointments";
import PatientPrescriptions from "./pages/patient/Prescription";

import { AuthContext } from "./context/AuthContext";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";

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
  }, [updateToken]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  const isLoggedIn = user !== null;
  const type = user?.type || "";

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route element={<DoctorRoute isLoggedIn={isLoggedIn} type={type} />}>
          <Route path="/doctor/dashboard" element={<DoctorPrescriptions />} />
          <Route path="/doctor/discussions" element={<DoctorDiscussion />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/schedule" element={<DoctorSchedule />} />
          <Route
            path="/doctor/prescriptions"
            element={<DoctorPrescriptions />}
          />
          <Route
            path="/doctor/appointments/new"
            element={<DoctorApppointmentsAdd />}
          />
          <Route
            path="/doctor/appointments/:id"
            element={<DoctorAppointmentsEdit />}
          />
          <Route
            path="/doctor/schedule/change"
            element={<DoctorScheduleChange />}
          />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
        </Route>
        <Route element={<PatientRoute isLoggedIn={isLoggedIn} type={type} />}>
          <Route path="/patient/doctors" element={<ChooseDoctor />} />
          <Route path="/patient/dashboard" element={<PatientPrescriptions />} />
          <Route
            path="/patient/appointments"
            element={<PatientAppointments />}
          />
          <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/patient/schedule" element={<PatientSchedule />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route
            path="/patient/appointments/new"
            element={<PatientAppointmentsAdd />}
          />
        </Route>
        <Route path="*" element={<div>404 page not found</div>} />
      </Routes>
    </>
  );
};

export default App;
