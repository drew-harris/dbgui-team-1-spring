/* eslint-disable no-unused-vars */
import Button from "@mui/material/Button";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/nav/DoctorNavBar";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      <NavBar></NavBar>
    </div>
  );
}
