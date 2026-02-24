import { Link } from "react-router-dom";
import { clsx } from "clsx";
import AddToCartButton from "./AddToCartButton";
import Badge from "./ui/Badge";

/**
 * Card reutilizable para un producto en el grid de Home.
 *
 * Separamos esta lógica de Home.jsx porque:
 * 1. Responsabilidad única: Home maneja el listado, ProductCard maneja la presentación
 * 2. Reutilizable en otras vistas (búsqueda, favoritos, admin)
 * 3. Facilita aplicar React.memo() en el futuro si el grid crece
 *
 * El botón AddToCartButton está FUERA del <Link> para evitar el problema
 * de "nested interactive content": si el botón estuviera dentro del Link,
 * el click en el botón navegaría a la página de detalle en lugar de agregar al carrito.
 */
const ProductCard = ({ product, user }) => {
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className={clsx(
        "relative bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      )}
    >
      {/* Badge de stock (esquina superior izquierda) — solo si es relevante */}
      {isLowStock && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="warning">¡Últimas {product.stock}!</Badge>
        </div>
      )}
      {isOutOfStock && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="danger">Sin stock</Badge>
        </div>
      )}

      {/* Link envuelve solo la imagen e info — no el botón */}
      <Link to={`/users/products/${product._id}`}>
        {/* Imagen con zoom en hover via CSS — framer-motion sería overkill para esto */}
        <div className="overflow-hidden bg-gray-50 dark:bg-gray-700">
          <img
            src={product.img}
            alt={product.title}
            className="w-full h-48 object-contain object-center transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h2 className="text-sm font-semibold text-center text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
            {product.title}
          </h2>
          <div className="flex justify-center items-center gap-3 mb-1">
            <Badge variant="info">{product.category}</Badge>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
              ${product.price}
            </span>
          </div>
        </div>
      </Link>

      {/* Botón fuera del Link */}
      <div className="px-4 pb-4">
        {user && !isOutOfStock ? (
          <AddToCartButton cartId={user.cart} productId={product._id} />
        ) : isOutOfStock ? (
          <button
            disabled
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 py-2 rounded-2xl cursor-not-allowed text-sm"
          >
            Sin stock
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
