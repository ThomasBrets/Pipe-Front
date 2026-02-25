import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import api from "../utils/axios";
import { useUser } from "../context/userContext";

/**
 * useAuth: encapsula las operaciones de autenticación.
 *
 * Centraliza login, logout y register para que Login.jsx, Register.jsx
 * y Navbar.jsx no repitan la misma lógica de API + toasts.
 * Cada página conserva su propia validación de formulario (eso es UI, no auth).
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { refreshUser, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const login = async ({ email, password }) => {
    setIsLoading(true);
    try {
      await api.post("/auth/login", { email, password });
      sileo.success({
        title: "¡Bienvenido!",
        description: "Sesión iniciada correctamente",
      });
      await refreshUser();
      navigate("/products");
    } catch (error) {
      const msg = error.response?.data?.error || "Error al iniciar sesión";
      sileo.error({ title: "Error al iniciar sesión", description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      sileo.info({ title: "Sesión cerrada", description: "¡Hasta pronto!" });
      navigate("/");
    } catch {
      sileo.error({ title: "Error al cerrar sesión" });
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", formData);
      sileo.success({
        title: "¡Cuenta creada!",
        description: "Ya podés iniciar sesión",
      });
      setTimeout(() => navigate("/auth/login"), 800);
    } catch (err) {
      const msg = err.response?.data?.error || "Error al registrarse";
      sileo.error({ title: "Error al registrarse", description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return { login, logout, register, isLoading };
};
