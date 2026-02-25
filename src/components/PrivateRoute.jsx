import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Verificando sesión...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/auth/login" />;
};

export default PrivateRoute;
