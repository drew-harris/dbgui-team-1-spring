import React from "react";
import { Appointments } from "../../components/appointments/Appointments";
import NavBar from "../../components/nav/DoctorNavBar";

function Appointment() {
  return (
    <div className="App">
      <NavBar />
      <Appointments />
    </div>
  );
}

export default Appointment;
