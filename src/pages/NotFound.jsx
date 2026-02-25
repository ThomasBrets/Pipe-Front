import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";
import { useUser } from "../context/userContext";

const NotFound = () => {
  const { user } = useUser();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-9xl font-black text-indigo-200 dark:text-indigo-900 mb-2 select-none leading-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Página no encontrada
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          La ruta que buscás no existe o fue movida.
        </p>
        <Link
          to={user ? "/products" : "/"}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          <FaHome /> Volver al inicio
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
