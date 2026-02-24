import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { validateEmail } from "../utils/helper";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /**
   * `touched`: registra qué campos el usuario ya interactuó (hizo blur).
   * onBlur: muestra errores cuando el usuario sale del campo → mejor UX.
   * Al hacer submit, marcamos todos como touched para revelar todos los errores.
   */
  const [touched, setTouched] = useState({});

  const validate = useCallback(() => {
    const errors = {};
    if (!validateEmail(email)) errors.email = "Ingresá un email válido";
    if (!password) errors.password = "La contraseña es requerida";
    else if (password.length < 6) errors.password = "Mínimo 6 caracteres";
    return errors;
  }, [email, password]);

  const errors = validate();
  const hasErrors = Object.keys(errors).length > 0;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (hasErrors) return;
    await login({ email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-xl p-8">
          {/* Header con logo */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3">
              <span className="text-2xl">🛍️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Iniciar sesión
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Bienvenido a Pipe Store
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              icon={FaEnvelope}
              error={touched.email ? errors.email : undefined}
            />

            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              icon={FaLock}
              rightIcon={showPassword ? FaEyeSlash : FaEye}
              onRightIconClick={() => setShowPassword((prev) => !prev)}
              error={touched.password ? errors.password : undefined}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
              className="mt-2"
            >
              Ingresar
            </Button>
          </form>

          <p className="text-sm text-center mt-5 text-gray-500 dark:text-gray-400">
            ¿No tenés una cuenta?{" "}
            <Link
              to="/auth/register"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Registrate
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
