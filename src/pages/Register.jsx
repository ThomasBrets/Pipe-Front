import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaCalendarAlt } from "react-icons/fa";
import { validateEmail } from "../utils/helper";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Register = () => {
  const { register, isLoading } = useAuth();

  /**
   * Agrupamos todos los campos del form en un solo objeto en lugar de
   * múltiples useState individuales porque:
   * 1. Reduce la cantidad de state declarations (5 → 1)
   * 2. La función `handleChange` es reutilizable para cualquier campo
   * 3. Facilita enviar el form completo a la API (ya es un objeto)
   */
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    password: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  // Factory function: genera un handler de onChange para cualquier campo del form
  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validate = useCallback(() => {
    const errors = {};
    if (!form.first_name.trim()) errors.first_name = "El nombre es requerido";
    if (!form.last_name.trim()) errors.last_name = "El apellido es requerido";
    if (!validateEmail(form.email)) errors.email = "Ingresá un email válido";
    if (!form.age) errors.age = "La edad es requerida";
    else if (Number(form.age) < 18) errors.age = "Debés ser mayor de 18 años";
    if (!form.password) errors.password = "La contraseña es requerida";
    else if (form.password.length < 6) errors.password = "Mínimo 6 caracteres";
    return errors;
  }, [form]);

  const errors = validate();
  const hasErrors = Object.keys(errors).length > 0;

  const handleRegister = async (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados para revelar todos los errores
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      age: true,
      password: true,
    });

    if (hasErrors) return;

    await register({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      age: Number(form.age),
      password: form.password,
      role: isAdmin ? "admin" : "user",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3">
              <span className="text-2xl">🛍️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Crear cuenta
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Unite a Pipe Store hoy
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            {/* Nombre y apellido en grid de 2 columnas */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre"
                placeholder="Juan"
                value={form.first_name}
                onChange={handleChange("first_name")}
                onBlur={() => handleBlur("first_name")}
                icon={FaUser}
                error={touched.first_name ? errors.first_name : undefined}
              />
              <Input
                label="Apellido"
                placeholder="Pérez"
                value={form.last_name}
                onChange={handleChange("last_name")}
                onBlur={() => handleBlur("last_name")}
                icon={FaUser}
                error={touched.last_name ? errors.last_name : undefined}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange("email")}
              onBlur={() => handleBlur("email")}
              icon={FaEnvelope}
              error={touched.email ? errors.email : undefined}
            />

            <Input
              label="Edad"
              type="number"
              placeholder="18"
              value={form.age}
              onChange={handleChange("age")}
              onBlur={() => handleBlur("age")}
              icon={FaCalendarAlt}
              error={touched.age ? errors.age : undefined}
            />

            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange("password")}
              onBlur={() => handleBlur("password")}
              icon={FaLock}
              rightIcon={showPassword ? FaEyeSlash : FaEye}
              onRightIconClick={() => setShowPassword((prev) => !prev)}
              error={touched.password ? errors.password : undefined}
            />

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 accent-indigo-600"
              />
              <label
                htmlFor="admin"
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                Registrarme como Admin
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
              className="mt-2"
            >
              Crear cuenta
            </Button>
          </form>

          <p className="text-sm text-center mt-5 text-gray-500 dark:text-gray-400">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/auth/login"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
