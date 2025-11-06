import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";
import api from "../utils/axios";
import ps5 from "../assets/ps5.jpeg";
import { useUser } from "../context/userContext";

const ProductDetail = () => {
  const { pid } = useParams();
  const { user, error } = useUser();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await api.get(`/users/products/${pid}`);
        setProduct(res.data);
      } catch (error) {
        console.error("❌ Error al obtener el producto:", error);
        setError("No se pudo cargar el producto");
      }
    };

    getProduct();
  }, [pid]);

  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!product) return <p className="text-center mt-6">Cargando...</p>;
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl w-full flex flex-col sm:flex-row gap-8">
        <img
          src={product.img || ps5}
          alt={product.title}
          className="w-full sm:w-1/2 h-64 object-contain object-center rounded-lg bg-white"
        />
        <div className="flex flex-col justify-between sm:w-1/2">
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-3">{product.description}</p>
            <p className="text-blue-600 font-bold text-xl mb-1">
              ${product.price}
            </p>
            <p className="text-gray-500 text-sm mb-1">Stock: {product.stock}</p>
            <p className="text-gray-500 text-sm">
              Categoría: {product.category}
            </p>
          </div>
          {user && (
            <AddToCartButton cartId={user.cart} productId={product._id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
