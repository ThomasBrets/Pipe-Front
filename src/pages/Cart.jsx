import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import ps5 from "../assets/ps5.jpeg";
import { useUser } from "../context/userContext";
import { useCart } from "../hooks/useCart";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

const Cart = () => {
  const navigate = useNavigate();
  const { cartLoading } = useUser();
  const {
    cart,
    refreshCart,
    updateQuantity,
    removeProduct,
    clearCart,
    cartPurchase,
    isClearing,
    isPurchasing,
  } = useCart();

  const [showClearModal, setShowClearModal] = useState(false);

  // Refresca el carrito al entrar a la página para asegurarse de mostrar
  // los ítems más recientes (ej: productos agregados desde Home o ProductDetail)
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  /**
   * total se calcula del cart que viene del context (vía useCart).
   * Cuando cart cambia (refreshCart), este cálculo se re-ejecuta automáticamente.
   * No necesitamos useMemo acá porque useCart ya garantiza que cart es estable.
   */
  const total = cart?.products
    ? cart.products.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      )
    : 0;

  const handleClearCart = async () => {
    await clearCart();
    setShowClearModal(false);
  };

  // ── Estado de carga inicial (context todavía fetcheando el cart) ──
  if (cartLoading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Cargando carrito...</p>
    </div>
  );

  // ── Empty state ──
  if (!cart || cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4 px-4">
        <FaShoppingCart className="text-7xl text-gray-200 dark:text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
          Tu carrito está vacío
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          ¡Explorá los productos y agregá algo!
        </p>
        <Button onClick={() => navigate("/products")}>Ver productos</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Tu carrito
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Lista de productos ── */}
          <div className="lg:col-span-2 space-y-3">
            {/*
             * AnimatePresence permite animar la SALIDA de elementos.
             * React normalmente desmonta componentes instantáneamente.
             * AnimatePresence "retiene" el elemento mientras ejecuta la
             * animación `exit`, luego lo desmonta.
             */}
            <AnimatePresence>
              {cart.products.map((item) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 80 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-4 flex items-center gap-4"
                >
                  <img
                    src={item.product.img || ps5}
                    alt={item.product.title}
                    className="w-16 h-16 object-contain bg-gray-50 dark:bg-gray-700 rounded-lg shrink-0"
                  />
                  {/* Info + controles: columna en mobile, fila en sm+ */}
                  <div className="flex-1 min-w-0 flex flex-col gap-3">
                    {/* Fila superior: título + subtotal */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                          {item.product.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
                          ${item.product.price} c/u
                        </p>
                      </div>
                      <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm sm:text-base shrink-0">
                        ${item.product.price * item.quantity}
                      </p>
                    </div>

                    {/* Fila inferior: controles de cantidad + botón eliminar */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-base sm:text-lg font-medium cursor-pointer"
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center text-sm sm:text-base font-semibold dark:text-gray-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-base sm:text-lg font-medium cursor-pointer"
                      >
                        +
                      </button>
                      {/* Botón eliminar al extremo derecho */}
                      <button
                        onClick={() => removeProduct(item.product._id)}
                        className="ml-auto text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer text-base sm:text-lg"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Sidebar: resumen del pedido ── */}
          {/*
           * lg:sticky lg:top-20: el sidebar se "pega" al top de la pantalla
           * mientras el usuario hace scroll en la lista de productos.
           * top-20 = 80px para dejar espacio a la navbar fija (64px + 16px gap).
           */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                Resumen del pedido
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Envío</span>
                  <span className={total > 50000 ? "text-green-500 font-medium" : ""}>
                    {total > 50000 ? "¡Gratis!" : "$2.500"}
                  </span>
                </div>
                <div className="border-t dark:border-gray-700 pt-3 flex justify-between font-bold text-base dark:text-gray-100">
                  <span>Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    ${total > 50000 ? total : total + 2500}
                  </span>
                </div>
              </div>

              <Button
                onClick={cartPurchase}
                isLoading={isPurchasing}
                fullWidth
                size="lg"
              >
                Finalizar compra
              </Button>

              <Button
                onClick={() => setShowClearModal(true)}
                variant="ghost"
                fullWidth
                size="sm"
              >
                Vaciar carrito
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para vaciar el carrito */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="¿Vaciar el carrito?"
        size="sm"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Esta acción eliminará todos los productos. ¿Estás seguro?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowClearModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            isLoading={isClearing}
            onClick={handleClearCart}
          >
            Vaciar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
