import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import { FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa";
import { clsx } from "clsx";
import api from "../utils/axios";
import ps5 from "../assets/ps5.jpeg";
import { useUser } from "../context/userContext";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { useCart } from "../hooks/useCart";

/**
 * Tabs definidos fuera del componente para evitar que el array
 * se recree en cada render. Son datos estáticos, no necesitan
 * estar dentro del closure del componente.
 */
const TABS = [
  { id: "descripcion", label: "Descripción" },
  { id: "specs", label: "Especificaciones" },
  { id: "envio", label: "Envío" },
];

const ProductDetail = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { refreshCart } = useCart();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("descripcion");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  /**
   * Estado local para la cantidad seleccionada.
   * Usamos estado local (no global/contexto) porque:
   * 1. La cantidad es específica a esta instancia de la página
   * 2. Al navegar a otro producto (pid cambia), quantity debe resetearse
   * 3. No tiene sentido compartir esta info con otros componentes
   */
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await api.get(`/users/products/${pid}`);
        setProduct(res.data);
      } catch (err) {
        setError("No se pudo cargar el producto");
      }
    };

    getProduct();
    // Resetear cantidad al cambiar de producto — evita que la cantidad
    // de un producto anterior "quede pegada" al navegar al siguiente
    setQuantity(1);
    setActiveTab("descripcion");
  }, [pid]); // Se re-ejecuta solo cuando cambia el ID del producto

  /**
   * useCallback para estabilizar las funciones de cantidad.
   * Al estar dentro de event handlers de botones memoizados,
   * esto evita re-renderizados innecesarios de los botones.
   *
   * La validación de stock es la regla de negocio principal:
   * no permitir agregar más unidades que el stock disponible.
   */
  const increment = useCallback(() => {
    setQuantity((prev) => Math.min(prev + 1, product?.stock ?? 1));
  }, [product?.stock]);

  const decrement = useCallback(() => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleAddToCart = async () => {
    if (!user?.cart) return;
    setIsAddingToCart(true);
    try {
      await api.post(`/users/carts/${user.cart}/products/${product._id}`, {
        quantity,
      });
      sileo.success({
        title: "¡Agregado al carrito!",
        description: `${quantity} × ${product.title}`,
      });
      // Actualiza el badge del Navbar sin recargar la página
      refreshCart();
    } catch (err) {
      sileo.error({
        title: "Error al agregar",
        description: err.response?.data?.error || "No se pudo agregar el producto",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  /**
   * Renderiza el contenido del tab activo.
   * Separado en función para que el JSX principal quede limpio.
   * Podría reemplazarse con un objeto { [tabId]: JSX } si los tabs crecen.
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case "descripcion":
        return (
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            {product.description || "Sin descripción disponible."}
          </p>
        );
      case "specs":
        return (
          <dl className="space-y-2 text-sm">
            {[
              { label: "Categoría", value: product.category },
              { label: "Stock", value: `${product.stock} unidades` },
              { label: "Código", value: product.code },
              { label: "ID", value: product._id },
            ]
              .filter(({ value }) => Boolean(value))
              .map(({ label, value }) => (
                <div key={label} className="flex gap-2">
                  <dt className="font-medium text-gray-500 dark:text-gray-400 w-24 shrink-0">
                    {label}:
                  </dt>
                  <dd className="text-gray-800 dark:text-gray-200 break-all">
                    {value}
                  </dd>
                </div>
              ))}
          </dl>
        );
      case "envio":
        return (
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>✅ Envío gratis en compras mayores a $50.000</li>
            <li>📦 Envío estándar: 3-5 días hábiles</li>
            <li>🚀 Envío express: 24-48 horas (con cargo adicional)</li>
            <li>🔄 Devoluciones gratuitas dentro de los 30 días</li>
          </ul>
        );
      default:
        return null;
    }
  };

  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!product) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Cargando producto...</p>
    </div>
  );

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Botón volver — navigate(-1) vuelve al historial anterior */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6 cursor-pointer"
        >
          <FaArrowLeft className="text-xs" />
          Volver a productos
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* ── Columna izquierda: imagen ── */}
            <div className="bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-10">
              <div className="overflow-hidden rounded-xl w-full">
                {/*
                 * Zoom en hover via CSS transition: hover:scale-110 en la imagen.
                 * El overflow-hidden del wrapper recorta la imagen para que no
                 * sobresalga del contenedor al hacer zoom.
                 */}
                <img
                  src={product.img || ps5}
                  alt={product.title}
                  className="w-full h-72 object-contain object-center transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>

            {/* ── Columna derecha: info ── */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                {/* Badges de estado */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {product.category && (
                    <Badge variant="info">{product.category}</Badge>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <Badge variant="warning">¡Solo {product.stock} disponibles!</Badge>
                  )}
                  {isOutOfStock && <Badge variant="danger">Sin stock</Badge>}
                </div>

                {/* Título */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                  {product.title}
                </h1>

                {/* Precio destacado */}
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
                  ${product.price}
                </p>

                {/* ── Tabs ── */}
                <div className="border-b dark:border-gray-600 mb-4">
                  <div className="flex gap-4">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                          "pb-2 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer",
                          activeTab === tab.id
                            ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contenido del tab — min-h para evitar layout shift entre tabs */}
                <div className="min-h-[80px] mb-6">{renderTabContent()}</div>
              </div>

              {/* ── Controles de compra ── */}
              {user && (
                <div className="space-y-4">
                  {/* Selector de cantidad */}
                  {!isOutOfStock && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Cantidad:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={decrement}
                          disabled={quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <FaMinus className="text-xs dark:text-gray-200" />
                        </button>

                        <span className="w-8 text-center font-semibold dark:text-gray-100">
                          {quantity}
                        </span>

                        {/*
                         * Validación de stock: no permite superar el stock disponible.
                         * Math.min en increment() garantiza que quantity ≤ product.stock.
                         * El disabled visual da feedback inmediato al usuario.
                         */}
                        <button
                          onClick={increment}
                          disabled={quantity >= product.stock}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <FaPlus className="text-xs dark:text-gray-200" />
                        </button>

                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          ({product.stock} disponibles)
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleAddToCart}
                    isLoading={isAddingToCart}
                    disabled={isOutOfStock}
                    fullWidth
                    size="lg"
                    variant={isOutOfStock ? "secondary" : "primary"}
                  >
                    {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
