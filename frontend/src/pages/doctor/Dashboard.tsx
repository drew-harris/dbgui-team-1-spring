import Button from "@mui/material/Button";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import NavBar from "../../components/all/NavBar";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <NavBar />
      <h1>Doctor Dashboard</h1>
      <Button>Test MUI Button</Button>
    </>
  );
}
