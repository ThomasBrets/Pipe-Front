import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaUser,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { getInitials } from "../utils/helper";
import { useUser } from "../context/userContext";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, cart } = useUser();
  const [isDark, toggleDark] = useDarkMode();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /**
   * cartCount se calcula directo del cart en context.
   * No hace un fetch propio — se actualiza automáticamente cada vez que
   * cualquier componente llama refreshCart() (agregar, eliminar, comprar).
   */
  const cartCount =
    cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Cerrar dropdown al clickear fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-indigo-200 transition-colors duration-200"
          >
            <FaShoppingBag className="text-2xl" />
            <span className="text-xl font-bold tracking-tight">Pipe Store</span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-5">

            {/* Carrito con badge — count viene del context, no de un fetch local */}
            <button
              onClick={() => navigate(`/users/carts/${user?.cart}`)}
              className="relative text-white hover:text-indigo-200 transition-colors duration-200 cursor-pointer"
            >
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Toggle dark mode */}
            <button
              onClick={toggleDark}
              title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className="text-white hover:text-indigo-200 transition-colors duration-200 text-xl cursor-pointer"
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            {/* Avatar + dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-colors duration-200 cursor-pointer"
                >
                  {getInitials(user.first_name, user.last_name)}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                    {/* Header del dropdown */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Opciones */}
                    <button
                      onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <FaUser className="text-xs text-gray-400 dark:text-gray-500" />
                      Mi perfil
                    </button>

                    {user.role === "admin" && (
                      <button
                        onClick={() => { navigate("/admin/products"); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <FaShieldAlt className="text-xs text-indigo-400" />
                        Panel Admin
                      </button>
                    )}

                    <div className="border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                      >
                        <FaSignOutAlt className="text-xs" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Mobile: carrito + dark + hamburger ── */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => navigate(`/users/carts/${user?.cart}`)}
              className="relative text-white"
            >
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleDark}
              className="text-white text-lg cursor-pointer"
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="text-white text-xl cursor-pointer"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-700 dark:bg-gray-800 border-t border-indigo-500 dark:border-gray-700 px-4 py-3 space-y-1">
          {user && (
            <div className="border-b border-indigo-500 dark:border-gray-700 pb-3 mb-3">
              <p className="text-white font-semibold text-sm">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-indigo-200 dark:text-gray-400 text-xs">
                {user.email}
              </p>
            </div>
          )}

          <button
            onClick={() => { navigate("/"); setIsMenuOpen(false); }}
            className="flex items-center w-full text-left text-white hover:text-indigo-200 py-2 text-sm transition-colors duration-150"
          >
            Productos
          </button>

          <button
            onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}
            className="flex items-center gap-2 w-full text-left text-white hover:text-indigo-200 py-2 text-sm transition-colors duration-150"
          >
            <FaUser className="text-xs" /> Mi perfil
          </button>

          {user?.role === "admin" && (
            <button
              onClick={() => { navigate("/admin/products"); setIsMenuOpen(false); }}
              className="flex items-center gap-2 w-full text-left text-white hover:text-indigo-200 py-2 text-sm transition-colors duration-150"
            >
              <FaShieldAlt className="text-xs" /> Panel Admin
            </button>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 py-2 text-sm transition-colors duration-150"
          >
            <FaSignOutAlt className="text-xs" /> Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
