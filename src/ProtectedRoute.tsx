import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

interface Props {
  requiredRole?: "Admin" | "Barbero" | "Cliente";
}

export const ProtectedRoute = ({ requiredRole }: Props) => {
  const { isAuthenticated, loading, user } = useAuth();

    if (loading) return <p>Cargando...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};