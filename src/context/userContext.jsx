import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1️⃣ Cargar usuario primero
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/current");
        setUser(res.data);
      } catch (err) {
        console.error("❌ Error al obtener usuario:", err);
        setError("No autorizado o sesión expirada");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 2️⃣ Cuando haya usuario, cargar productos
  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      try {
        const res = await api.get("/users/products?limit=10");
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error al obtener productos:", err);
        setError("Error al cargar los productos");
      }
    };

    fetchProducts();
  }, [user]); // 👈 se dispara recién cuando user existe

  return (
    <UserContext.Provider
      value={{ user, setUser, products, setProducts, loading, error }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
