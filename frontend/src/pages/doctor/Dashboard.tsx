import Button from "@mui/material/Button";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    console.log(user);
  }, [user]);


  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <Button>Test MUI Button</Button>
      <Button onClick={() => (navigate("/doctor/discussions"))}> Discussion Board</Button>
    </div>
  );
}
