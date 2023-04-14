import { Navigate, Outlet } from "react-router-dom";

interface PatientRouteProps {
  isLoggedIn: boolean;
  type: string;
}

export default function PatientRoute({ isLoggedIn, type }: PatientRouteProps) {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (type != "patient") {
    return <Navigate to="/doctor/dashboard" />;
  }

  return <Outlet />;
}
