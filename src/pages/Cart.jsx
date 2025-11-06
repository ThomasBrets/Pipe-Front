import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import ps5 from "../assets/ps5.jpeg";
import { useUser } from "../context/userContext";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  //! Calcular total
  const calculateTotal = (cartData) => {
    const totalAmount = cartData.products.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
    setTotal(totalAmount);
  };

  //! Obtener carrito
  const getCart = async () => {
    try {
      const cartId = user.cart;
      const cartRes = await api.get(`/users/carts/${cartId}`);
      setCart(cartRes.data);
      calculateTotal(cartRes.data);
    } catch (err) {
      console.error("❌ Error al obtener el carrito:", err);
      setError("No se pudo cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  //! Actualizar cantidad
  const updateQuantity = async (pid, newQuantity) => {
    try {
      //Si el producto baja de 0 lo elimina
      if (newQuantity <= 0) {
        await removeProduct(pid);
        return;
      }
      await api.put(`/users/carts/${cart._id}/products/${pid}`, {
        quantity: newQuantity,
      });
      getCart(); // Refrescamos el carrito
    } catch (err) {
      console.error("❌ Error al actualizar cantidad:", err);
    }
  };

  //! Eliminar producto
  const removeProduct = async (pid) => {
    try {
      await api.delete(`/users/carts/${cart._id}/products/${pid}`);
      getCart();
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err);
    }
  };

  //! Vaciar carrito
  const clearCart = async () => {
    try {
      await api.delete(`/users/carts/${cart._id}`);
      getCart();
    } catch (err) {
      console.error("❌ Error al vaciar el carrito:", err);
    }
  };

  //!Purchase
  const cartPurchase = async () => {
    try {
      await api.post(`/users/carts/${cart._id}/purchase`);
      alert("Compra realizada con éxito");
      getCart();
    } catch (err) {
      console.error("Error al realizar la compra", err);
      alert("Hubo un error al procesar la compra.");
    }
  };

  useEffect(() => {
    if (user && user.cart) {
      getCart();
    }
  }, [user]);

  if (loading || !cart)
    return (
      <p className="text-center mt-6 text-gray-600">Cargando carrito...</p>
    );
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🛍️ Tu carrito
      </h1>

      {cart.products.length === 0 ? (
        <p className="text-center text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
          {cart.products.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.img || ps5}
                  alt={item.product.title}
                  className="w-20 h-20 object-contain bg-white rounded-lg"
                />
                <div>
                  <h2 className="font-semibold text-lg">
                    {item.product.title}
                  </h2>
                  <p className="text-gray-500">${item.product.price} c/u</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity - 1)
                  }
                  className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="font-semibold">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity + 1)
                  }
                  className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                >
                  +
                </button>

                <p className="font-bold text-blue-600 w-20 text-right">
                  ${item.product.price * item.quantity}
                </p>

                <button
                  onClick={() => removeProduct(item.product._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6 border-t pt-4">
            <h2 className="text-xl font-bold">
              Total: <span className="text-blue-600">${total}</span>
            </h2>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={clearCart}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Vaciar carrito
              </button>
              <button
                onClick={cartPurchase}
                className=" bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
