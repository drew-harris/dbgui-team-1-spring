import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DoctorRoute from "./pages/context/DoctorRoute";
import PatientRoute from "./pages/context/PatientRoute";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorDiscussion from "./pages/doctor/Discussions";

import PatientDashboard from "./pages/patient/Dashboard";

import { getJwt, validateJwt } from "./utils/jwt";

const App: React.FC = () => {
  const [type, setType] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkJwt = async () => {
      const jwt = getJwt();
      if (jwt) {
        const decoded = await validateJwt(jwt);
        if (decoded) {
          setType(decoded.type);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route element={<DoctorRoute isLoggedIn={isLoggedIn} type={type} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/discussions" element={<DoctorDiscussion/>} />
        </Route>
        <Route element={<PatientRoute isLoggedIn={isLoggedIn} type={type} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
