import NavBar from "../../components/all/NavBar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppointments } from "../../hooks/useAppointments";

export default function Appointments() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-semibold">Appointments</h1>
        </div>
      </div>
    </>
  );
}
