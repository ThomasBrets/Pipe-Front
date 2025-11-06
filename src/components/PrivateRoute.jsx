import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../utils/axios"; // Ajustá la ruta si tu axios está en otra carpeta

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = cargando

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/users/current"); 
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Verificando sesión...</p>
      </div>
    );
  }

  return isAuth ? children : <Navigate to="/auth/login" />;
};

export default PrivateRoute;
