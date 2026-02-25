import "./App.css";
import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sileo";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

/**
 * Lazy Loading: cada página se importa de forma dinámica.
 *
 * React.lazy() le dice al bundler (Vite) que separe cada página
 * en un archivo JS independiente ("chunk"). El browser solo descarga
 * el chunk cuando el usuario navega a esa ruta por primera vez.
 *
 * Resultado: el bundle inicial es mucho más pequeño → primera carga más rápida.
 */
const Landing       = lazy(() => import("./pages/Landing"));
const Home          = lazy(() => import("./pages/Home"));
const Cart          = lazy(() => import("./pages/Cart"));
const Login         = lazy(() => import("./pages/Login"));
const Register      = lazy(() => import("./pages/Register"));
const Profile       = lazy(() => import("./pages/Profile"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminUsers    = lazy(() => import("./pages/AdminUsers"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound      = lazy(() => import("./pages/NotFound"));

/**
 * Fallback de Suspense: se muestra mientras React descarga el chunk de la página.
 * Spinner centrado con el mismo fondo que la app para evitar flash blanco.
 */
const PageLoader = () => (
  <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const location = useLocation();

  // Ocultar la Navbar en el landing y en las páginas de auth
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/auth/login" ||
    location.pathname === "/auth/register";

  return (
    <ErrorBoundary>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-[100dvh] transition-colors duration-300">
        <Toaster position="top-right" offset={{ top: 72 }} />
        {!hideNavbar && <Navbar />}
        <main className={!hideNavbar ? "pt-16" : ""}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Público */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />

              {/* Protegidos */}
              <Route path="/products" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/users/products/:pid" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
              <Route path="/users/carts/:cid" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

              {/* Admin */}
              <Route path="/admin/users" element={<PrivateRoute><AdminRoute><AdminUsers /></AdminRoute></PrivateRoute>} />
              <Route path="/admin/products" element={<PrivateRoute><AdminRoute><AdminProducts /></AdminRoute></PrivateRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
