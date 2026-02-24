import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";

/**
 * AdminRoute: guarda rutas exclusivas para admins.
 * A diferencia de PrivateRoute (que hace fetch propio), usa el user
 * del context que ya está disponible una vez superado PrivateRoute.
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-400 animate-pulse">Verificando permisos...</p>
    </div>
  );

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
