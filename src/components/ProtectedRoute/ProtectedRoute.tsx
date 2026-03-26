import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SiteHeader from "../SiteHeader/SiteHeader";

export default function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
}
