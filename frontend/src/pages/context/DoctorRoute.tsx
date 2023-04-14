import { Navigate, Outlet } from "react-router-dom";

interface DoctorRouteProps {
  isLoggedIn: boolean;
  type: string;
}

export default function DoctorRoute({ isLoggedIn, type }: DoctorRouteProps) {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (type != "doctor" && isLoggedIn) {
    return <Navigate to="/patient/dashboard" />;
  }
  if (type == "doctor" && isLoggedIn) {
    return <Navigate to="/doctor/dashboard" />;
  }

  return <Outlet />;
}
