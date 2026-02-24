import { useState } from "react";
import { sileo } from "sileo";
import api from "../utils/axios";

const AddToCartButton = ({ cartId, productId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post(`/users/carts/${cartId}/products/${productId}`, {
        quantity: 1,
      });
      sileo.success({
        title: "¡Agregado al carrito!",
        description: "El producto fue agregado correctamente",
      });
    } catch (error) {
      sileo.error({
        title: "Error al agregar",
        description:
          error.response?.data?.error || "No se pudo agregar el producto",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`w-full cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 rounded-2xl mt-4 transition ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? "Agregando..." : "Agregar al carrito"}
    </button>
  );
};

export default AddToCartButton;
