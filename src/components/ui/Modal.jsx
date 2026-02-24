import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { clsx } from "clsx";

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

/**
 * Modal reutilizable con backdrop blur y animaciones de framer-motion.
 *
 * Por qué AnimatePresence:
 * React desmonta componentes inmediatamente cuando se vuelven falsy.
 * AnimatePresence "retiene" el componente el tiempo necesario para
 * ejecutar la animación `exit` antes de desmontarlo.
 * Sin esto, el modal desaparecería instantáneamente (sin fade out).
 *
 * Formas de cerrar:
 * - Click en el backdrop (área fuera del modal)
 * - Tecla Escape
 * - Botón X en el header
 */
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  // Escuchar Escape para cerrar — mejor UX que obligar a usar el botón X
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    // Cleanup crucial: evita listeners acumulados si el componente re-renderiza
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop: fade in/out independiente del modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal: escala desde 0.95 para un efecto "pop" más natural */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={clsx(
              "relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl",
              "border border-gray-100 dark:border-gray-700",
              sizeStyles[size]
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
