import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sileo";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ProductDetail from "./pages/ProductDetail";

function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/auth/login" ||
    location.pathname === "/auth/register";
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* offset top: empuja los toasts 72px para que no queden tapados por la navbar fija (h-16 = 64px + 8px de aire) */}
      <Toaster position="top-right" offset={{ top: 72 }} />
      {!hideNavbar && <Navbar />}
      <main className={!hideNavbar ? "pt-16" : ""}>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/products/:pid"
            element={
              <PrivateRoute>
                <ProductDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/carts/:cid"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              </PrivateRoute>
            }
          />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
