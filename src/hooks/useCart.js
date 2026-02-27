import { useState } from "react";
import { sileo } from "sileo";
import api from "../utils/axios";
import { useUser } from "../context/userContext";

/**
 * useCart: encapsula todas las operaciones del carrito.
 *
 * Ventajas vs tener la lógica en Cart.jsx:
 * - Cart.jsx queda limpio (solo UI)
 * - Cualquier componente puede mutar el carrito y el badge del Navbar
 *   se actualiza automáticamente vía refreshCart → setCart en context
 * - Los loading states de operaciones (isClearing, isPurchasing)
 *   están aislados del componente que los consume
 */
export const useCart = () => {
  const { cart, refreshCart } = useUser();
  const [isClearing, setIsClearing] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const removeProduct = async (pid) => {
    try {
      await api.delete(`/users/carts/${cart._id}/products/${pid}`);
      refreshCart();
    } catch {
      sileo.error({ title: "Error al eliminar producto" });
    }
  };

  // updateQuantity depende de removeProduct, definido arriba
  const updateQuantity = async (pid, newQuantity) => {
    if (newQuantity <= 0) {
      await removeProduct(pid);
      return;
    }
    try {
      await api.put(`/users/carts/${cart._id}/products/${pid}`, {
        quantity: newQuantity,
      });
      refreshCart();
    } catch {
      sileo.error({ title: "Error al actualizar cantidad" });
    }
  };

  const clearCart = async () => {
    setIsClearing(true);
    try {
      await api.delete(`/users/carts/${cart._id}`);
      sileo.success({ title: "Carrito vaciado" });
      refreshCart();
    } catch {
      sileo.error({ title: "Error al vaciar el carrito" });
    } finally {
      setIsClearing(false);
    }
  };

  const cartPurchase = async () => {
    setIsPurchasing(true);
    const purchasePromise = api.post(`/users/carts/${cart._id}/purchase`, null, { timeout: 60000 });

    sileo.promise(purchasePromise, {
      loading: { title: "Procesando compra..." },
      success: {
        title: "¡Compra exitosa!",
        description: "Revisá tu email de confirmación",
      },
      error: {
        title: "Error en la compra",
        description: "No se pudo procesar tu pedido",
      },
    });

    try {
      await purchasePromise;
      refreshCart();
    } catch {
      // El error ya fue manejado por sileo.promise
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    cart,
    refreshCart,
    updateQuantity,
    removeProduct,
    clearCart,
    cartPurchase,
    isClearing,
    isPurchasing,
  };
};
