// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { getInitials } from "../utils/helper";
import { useUser } from "../context/userContext";

const Navbar = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //! Obtener usuario actual
  const { user } = useUser();

  //! Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/auth/login");
    } catch (err) {
      console.error("❌ Error al hacer logout:", err);
      setError(err);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      {/* Logo general */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold cursor-pointer hover:text-blue-200 transition"
      >
        E-Commerce
      </h1>

      <div className="flex items-center gap-6">
        {/* Carrito */}
        <button
          onClick={() => navigate(`/users/carts/${user.cart}`)}
          className="hover:text-blue-200 transition cursor-pointer"
        >
          🛒
        </button>
        {/* Perfil del usuario */}
        {user && (
          <div
            onClick={() => navigate("/profile")}
            className="bg-white text-blue-600 w-10 h-10 flex items-center justify-center rounded-full font-bold cursor-pointer hover:bg-blue-100 transition"
          >
            {getInitials(user.first_name, user.last_name)}
          </div>
        )}


        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded-lg font-semibold hover:bg-blue-100 cursor-pointer transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
