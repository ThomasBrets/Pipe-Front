import React from "react";
import api from "../utils/axios";

const AddToCartButton = ({ cartId, productId }) => {
  const handleAddToCart = async (e) => {
    // más adelante haremos la llamada al backend aquí
    e.preventDefault();

    try {
      const response = await api.post(
        `/users/carts/${cartId}/products/${productId}`,
        { quantity: 1 }
      );
      console.log(`🛒 Producto agregado al carrito:`, response.data);
      alert("Producto agregado al carrito 🛍️");
    } catch (error) {
      console.error("❌ Error al agregar producto al carrito:", error);
      alert("Hubo un error al agregar el producto.");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 rounded-2xl mt-4"
    >
      Agregar al carrito
    </button>
  );
};

export default AddToCartButton;
