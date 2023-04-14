import Button from "@mui/material/Button";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <Button>Test MUI Button</Button>
    </div>
  );
}
