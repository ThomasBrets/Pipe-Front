  import React, { useEffect, useState } from "react";
  import ps5 from "../assets/ps5.jpeg";
  import { Link } from "react-router-dom";
  import AddToCartButton from "../components/AddToCartButton";
  import { useUser } from "../context/userContext";

  const Home = () => {
      const [error, setError] = useState(null);

    
    const { user, products, loading} = useUser();
    console.log("PRODUCTS", products);
    console.log("USER", user);

if (loading) return <p className="text-center mt-10">Cargando usuario...</p>;
if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
if (!products) return <p className="text-center mt-10">Cargando productos...</p>;


    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🛒 Productos disponibles
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {products.map((product) => (
            <Link key={product._id} to={`/users/products/${product._id}`}>
              <div
                key={product._id}
                className="bg-white border rounded-2xl shadow hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-56 object-contain object-center rounded-t-2xl bg-white"
                />
                <div className="p-4">
                  <h2 className="text-lg text-center font-semibold mb-2">{product.title}</h2>
                  <div className="flex justify-center items-center">
                    <p className="text-gray-500 text-sm">{product.category}</p>
                    <p className="text-blue-600 font-bold text-lg m-3">
                      ${product.price}
                    </p>
                  </div>
                  {user && (
                    <AddToCartButton cartId={user.cart} productId={product._id} />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  export default Home;
