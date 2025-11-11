import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import api from "../utils/axios";
import { validateEmail } from "../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 🔹 Validaciones básicas
    if (!validateEmail(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    if (!password) {
      setError("Por favor ingresa tu contraseña");
      return;
    }

    setError(""); // limpia errores anteriores
    setIsLoading(true); // empieza el spinner
    try {
      // 🔹 Llamada al backend (ruta de login del ecommerce)
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ Login exitoso:", response.data);

      // 🔹 Redirige al home o dashboard
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } catch (error) {
      console.error(
        "❌ Error al iniciar sesión:",
        error.response?.data || error
      );
      setError(error.response?.data?.error || "Error al iniciar sesión");
    } finally {
      // 🔹 Siempre se ejecuta, éxito o error → detiene el loading
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-96 bg-white border rounded-2xl shadow p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Iniciar sesión
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            className="w-full border rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-300 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Iniciando sesión..." : "Ingresar"}
          </button>

          <p className="text-sm text-center mt-4">
            ¿No tenés una cuenta?{" "}
            <Link
              to="/auth/register"
              className="text-blue-600 font-medium underline hover:text-blue-700"
            >
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
