import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaShoppingBag,
  FaShoppingCart,
  FaShieldAlt,
  FaArrowRight,
  FaBolt,
} from "react-icons/fa";
import { useUser } from "../context/userContext";

const features = [
  {
    icon: <FaShoppingBag className="text-3xl text-indigo-300" />,
    title: "Catálogo completo",
    desc: "Explorá una amplia selección de productos con filtros inteligentes y búsqueda en tiempo real.",
  },
  {
    icon: <FaShoppingCart className="text-3xl text-purple-300" />,
    title: "Carrito inteligente",
    desc: "Agregá, modificá y finalizá compras de forma simple. Tu carrito siempre sincronizado.",
  },
  {
    icon: <FaShieldAlt className="text-3xl text-pink-300" />,
    title: "Panel de administración",
    desc: "Gestión completa de productos y usuarios. Creá, editá y eliminá con total control.",
  },
];

const Landing = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir directo a la tienda
  useEffect(() => {
    if (!loading && user) navigate("/products", { replace: true });
  }, [user, loading, navigate]);

  // Mientras verifica la sesión, no mostrar nada (evita flash del landing)
  if (loading) return null;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 flex flex-col">

      {/* ── Hero ── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">

        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
        >
          <FaShoppingBag className="text-white text-5xl" />
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight"
        >
          Pipe Store
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl md:text-2xl text-indigo-200 mb-3 max-w-xl"
        >
          La mejor experiencia de compra online, simple y rápida.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="flex items-center gap-2 text-indigo-300 text-sm mb-10"
        >
          <FaBolt className="text-yellow-400" />
          <span>React · Node.js · MongoDB</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/auth/register"
            className="flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors text-lg shadow-xl"
          >
            Crear cuenta <FaArrowRight className="text-sm" />
          </Link>
          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/30 transition-colors text-lg backdrop-blur-sm"
          >
            Ya tengo cuenta
          </Link>
        </motion.div>
      </div>

      {/* ── Features ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="bg-black/20 backdrop-blur-sm border-t border-white/10"
      >
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.15 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">{feat.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{feat.title}</h3>
              <p className="text-indigo-200/80 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
