import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import api from "../utils/axios";
import { validateEmail } from "../utils/helper";

const Register = () => {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores

    try {
      const response = await api.post("/auth/register", {
        first_name: first_name,
        last_name: last_name,
        email,
        age: Number(age),
        password,
        role: isAdmin ? "admin" : "user",
      });

      console.log("✅ Registro exitoso:", response.data);
      navigate("/auth/login"); // Redirige al login
    } catch (err) {
      console.error("❌ Error en registro:", err.response?.data || err);
      setError(err.response?.data?.error || "Error al registrarse");
    }
  };

  return (<div className="flex items-center justify-center mt-20">
      <div className="w-96 border rounded bg-white px-7 py-10 shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={first_name}
            onChange={(e) => setFirst_name(e.target.value)}
            className="w-full bg-transparent text-sm outline-none input-box border rounded px-3 py-2 mb-3"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={last_name}
            onChange={(e) => setLast_name(e.target.value)}
            className="w-full bg-transparent text-sm outline-none input-box border rounded px-3 py-2 mb-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-sm outline-none input-box border rounded px-3 py-2 mb-3"
          />
          <input
            type="number"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-transparent text-sm outline-none input-box border rounded px-3 py-2 mb-3"
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label htmlFor="admin" className="text-sm">Admin?</label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="btn-primary w-full">
            Crear cuenta
          </button>

          <p className="text-sm text-center mt-3">
            ¿Ya tienes cuenta?{" "}
            <Link to="/auth/login" className="text-primary underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>)
};

export default Register;
