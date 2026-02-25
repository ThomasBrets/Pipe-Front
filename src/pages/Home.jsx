import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useUser } from "../context/userContext";
import { useDebounce } from "../hooks/useDebounce";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/LoadingSkeleton";

const ITEMS_PER_PAGE = 12;

/**
 * Variantes de animación con efecto "stagger" (cascada):
 * cada card aparece 70ms después de la anterior en vez de todas juntas.
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
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Reset a página 1 cuando cambian los filtros o los productos
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, sortBy, products]);

  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((p) => p.title?.toLowerCase().includes(query));
    }

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "stock-desc": result.sort((a, b) => b.stock - a.stock); break;
      default: break;
    }

    return result;
  }, [products, selectedCategory, debouncedSearch, sortBy]);

  // Slice del array completo para la página actual
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const goToPage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Genera los números de página a mostrar (máx 5, con "..." implícito)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page, page - 1, page + 1].filter(n => n >= 1 && n <= totalPages));
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, page]);

  if (loading) return <ProductGridSkeleton count={ITEMS_PER_PAGE} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Productos disponibles
        </h1>

        {/* ── Controles: búsqueda + ordenamiento ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-3 pr-8 py-2.5 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
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
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
              {selectedCategory !== "all" && ` en "${selectedCategory}"`}
            </p>

            <motion.div
              key={page} // re-anima el grid al cambiar de página
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {paginatedProducts.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} user={user} />
                </motion.div>
              ))}
            </motion.div>

            {/* ── Paginación ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {/* Anterior */}
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FaChevronLeft className="text-xs" />
                </button>

                {/* Números de página */}
                {pageNumbers.map((n, i) => {
                  const prev = pageNumbers[i - 1];
                  return (
                    <span key={n} className="flex items-center gap-2">
                      {prev && n - prev > 1 && (
                        <span className="text-gray-400 text-sm px-1">…</span>
                      )}
                      <button
                        onClick={() => goToPage(n)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          n === page
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 border dark:border-gray-700"
                        }`}
                      >
                        {n}
                      </button>
                    </span>
                  );
                })}

                {/* Siguiente */}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
