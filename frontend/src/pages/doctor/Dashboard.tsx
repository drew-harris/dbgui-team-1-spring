import Button from "@mui/material/Button";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    console.log(user);
  }, [user]);


  return (
    <>
      <NavBar />
      <h1>Doctor Dashboard</h1>
      <Button>Test MUI Button</Button>
    </div>
  );
}
