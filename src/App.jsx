import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import ProductDetail from "./pages/ProductDetail";

function App() {
  const location = useLocation(); // ruta actual
  const hideNavbar =
    location.pathname === "/auth/login" ||
    location.pathname === "/auth/register";
  return (
    <div className=" bg-gray-100">
    {!hideNavbar && <Navbar />}
      <div className="p-4">
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
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
