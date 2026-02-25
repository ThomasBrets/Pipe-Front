import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../utils/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  // 1️⃣ Cargar usuario primero
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/current");
        setUser(res.data);
      } catch (err) {
        console.error("❌ Error al obtener usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 2️⃣ Cuando haya usuario, cargar productos y carrito en paralelo
  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      try {
        // limit=100 para cargar todos los productos y hacer paginación client-side
        const res = await api.get("/users/products?limit=100");
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error al obtener productos:", err);
      }
    };

    const fetchCart = async () => {
      if (!user.cart) return;
      setCartLoading(true);
      try {
        const res = await api.get(`/users/carts/${user.cart}`);
        setCart(res.data);
      } catch (err) {
        console.error("❌ Error al obtener carrito:", err);
      } finally {
        setCartLoading(false);
      }
    };

    fetchProducts();
    fetchCart();
  }, [user]);

  /**
   * refreshCart: re-fetchea el carrito desde el servidor y actualiza el context.
   * Llamarlo después de cualquier mutación al carrito (agregar, eliminar, actualizar,
   * vaciar, comprar) para que todos los componentes que leen el carrito del context
   * (badge del Navbar, página del carrito) queden sincronizados.
   *
   * useCallback: referencia estable — no provoca re-renders en los consumidores
   * que lo reciben como prop o dependencia.
   */
  const refreshCart = useCallback(async () => {
    if (!user?.cart) return;
    try {
      const res = await api.get(`/users/carts/${user.cart}`);
      setCart(res.data);
    } catch {
      // silently fail — badge simply won't update
    }
  }, [user?.cart]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        products,
        setProducts,
        cart,
        setCart,
        refreshCart,
        cartLoading,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
