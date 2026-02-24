import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useUser } from "../context/userContext";
import { useDebounce } from "../hooks/useDebounce";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/LoadingSkeleton";

/**
 * Variantes de animación para el grid con efecto "stagger" (cascada).
 *
 * staggerChildren: cada hijo del container aparece 70ms después del anterior.
 * Sin stagger, todos los productos aparecerían simultáneamente.
 * Con stagger, cada card "entra" al escenario de forma individual,
 * creando una animación más rica y que guía la vista del usuario.
 *
 * Los hijos heredan sus variantes del padre gracias al "propagation"
 * de framer-motion — no hace falta pasar variants a cada <motion.div> hijo.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Opciones de sort como constante fuera del componente:
// evita que el array se recree en cada render
const SORT_OPTIONS = [
  { value: "default", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre: A → Z" },
  { value: "stock-desc", label: "Mayor stock" },
];

const Home = () => {
  const { user, products, loading } = useUser();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  /**
   * Debounce de 300ms en el término de búsqueda.
   * El filtrado se aplica con `debouncedSearch`, no con `search`.
   * Esto significa que el input responde instantáneamente (search actualiza
   * sin delay), pero el filtrado pesado solo ocurre cuando el usuario
   * deja de escribir por 300ms — evita filtrar en cada keystroke.
   */
  const debouncedSearch = useDebounce(search, 300);

  /**
   * Extrae categorías únicas de los productos disponibles.
   *
   * useMemo porque: las categorías solo cambian si `products` cambia.
   * Sin memo, se recalcularían en cada render (ej: al escribir en el search),
   * aunque los productos no hayan cambiado.
   */
  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  }, [products]);

  /**
   * Filtra y ordena los productos según los criterios del usuario.
   *
   * useMemo es crítico aquí porque:
   * 1. Filtra/ordena un array potencialmente grande
   * 2. Solo debe recalcularse cuando cambian los inputs del filtro
   * 3. Sin memo, se ejecutaría en cada render (ej: al abrir el dropdown de sort)
   *
   * Usamos `debouncedSearch` (no `search`) para que el filtrado
   * no ocurra en cada tecla presionada.
   */
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Filtro por categoría seleccionada
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filtro por búsqueda de texto (case-insensitive)
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(query)
      );
    }

    // Ordenamiento — switch es más claro que if/else para múltiples casos
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "stock-desc":
        result.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, debouncedSearch, sortBy]);

  /**
   * useCallback para estabilizar la referencia de esta función.
   * Si ProductCard o un SearchBar custom estuvieran memoizados con React.memo,
   * recibir una nueva referencia de función en cada render los haría re-renderizar.
   * useCallback asegura que la referencia solo cambie cuando las deps cambian.
   */
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  // Mostrar skeleton con la cantidad exacta de items que devuelve la API
  if (loading) return <ProductGridSkeleton count={10} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Productos disponibles
        </h1>

        {/* ── Controles: búsqueda + ordenamiento ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Búsqueda con icono */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Selector de ordenamiento */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-3 pr-8 py-2.5 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Tabs de categorías ── */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Grid de productos ── */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No se encontraron productos
            </p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("all"); }}
              className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
              {selectedCategory !== "all" && ` en "${selectedCategory}"`}
            </p>

            {/*
             * motion.div con variants de stagger:
             * El container emite "animate" → cada hijo recibe sus variants.
             * Cada hijo aparece 70ms después del anterior (staggerChildren).
             * Esto crea la ilusión de una animación coordinada sin
             * tener que sincronizar manualmente los delays.
             */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} user={user} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
