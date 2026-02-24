import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";
import { FaSearch, FaTrash, FaPlus, FaBox, FaEdit } from "react-icons/fa";
import api from "../utils/axios";
import { useUser } from "../context/userContext";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";

// Formulario vacío reutilizable para create y reset
const emptyForm = {
  title: "",
  description: "",
  price: "",
  img: "",
  code: "",
  stock: "",
  category: "",
  status: true,
};

const AdminProducts = () => {
  const { setProducts: setContextProducts } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Estados para eliminar
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados para crear
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);

  const handleFormChange = (field) => (e) => {
    const value = field === "status" ? e.target.checked : e.target.value;
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Endpoint público: GET /api/products (sin ?limit= devuelve todos)
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      sileo.error({ title: "Error al cargar productos" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/products/${deleteTarget._id}`);
      sileo.success({
        title: "Producto eliminado",
        description: deleteTarget.title,
      });
      setDeleteTarget(null);
      fetchProducts();
      // Invalida también los productos del context (grid de Home)
      setContextProducts(null);
    } catch (err) {
      const msg = err.response?.data?.error || "No se pudo eliminar el producto";
      sileo.error({ title: "Error al eliminar", description: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.price || !createForm.code || !createForm.stock) {
      sileo.error({ title: "Completá los campos requeridos" });
      return;
    }
    setIsCreating(true);
    try {
      await api.post("/products", {
        ...createForm,
        price: Number(createForm.price),
        stock: Number(createForm.stock),
      });
      sileo.success({ title: "Producto creado", description: createForm.title });
      setShowCreateModal(false);
      setCreateForm(emptyForm);
      fetchProducts();
      // Invalida los productos del context para que Home los recargue
      setContextProducts(null);
    } catch (err) {
      const msg = err.response?.data?.error || "No se pudo crear el producto";
      sileo.error({ title: "Error al crear", description: msg });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <FaBox className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gestión de productos
              </p>
            </div>
          </div>

          <Button onClick={() => setShowCreateModal(true)}>
            <FaPlus className="mr-2 text-xs" />
            Nuevo producto
          </Button>
        </div>

        {/* Buscador */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre, categoría o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-400 animate-pulse">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <FaBox className="text-5xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {search ? "No se encontraron productos" : "No hay productos"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">

            {/* Header de tabla */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <span className="col-span-4">Producto</span>
              <span className="col-span-2">Categoría</span>
              <span className="col-span-2 text-right">Precio</span>
              <span className="col-span-2 text-right">Stock</span>
              <span className="col-span-2 text-right">Acciones</span>
            </div>

            <AnimatePresence>
              {filteredProducts.map((p, idx) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center ${
                    idx < filteredProducts.length - 1
                      ? "border-b dark:border-gray-700"
                      : ""
                  }`}
                >
                  {/* Nombre + código */}
                  <div className="col-span-4 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {p.code}
                    </p>
                  </div>

                  {/* Categoría */}
                  <div className="col-span-2">
                    <Badge variant="info">{p.category}</Badge>
                  </div>

                  {/* Precio */}
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      ${p.price}
                    </span>
                  </div>

                  {/* Stock con badge de alerta */}
                  <div className="col-span-2 text-right">
                    {p.stock === 0 ? (
                      <Badge variant="danger">Sin stock</Badge>
                    ) : p.stock < 10 ? (
                      <Badge variant="warning">{p.stock} uds.</Badge>
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {p.stock} uds.
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer p-1"
                      title="Eliminar producto"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Contador */}
        {!loading && filteredProducts.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-right">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
            {search && ` encontrados para "${search}"`}
          </p>
        )}
      </div>

      {/* Modal: eliminar producto */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="¿Eliminar producto?"
        size="sm"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Vas a eliminar{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {deleteTarget?.title}
          </span>
          . Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancelar
          </Button>
          <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>

      {/* Modal: crear producto */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setCreateForm(emptyForm); }}
        title="Nuevo producto"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Título *"
              placeholder="Nombre del producto"
              value={createForm.title}
              onChange={handleFormChange("title")}
            />
            <Input
              label="Código *"
              placeholder="SKU-001"
              value={createForm.code}
              onChange={handleFormChange("code")}
            />
          </div>

          <Input
            label="Descripción *"
            placeholder="Descripción del producto"
            value={createForm.description}
            onChange={handleFormChange("description")}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Precio *"
              type="number"
              placeholder="0"
              value={createForm.price}
              onChange={handleFormChange("price")}
            />
            <Input
              label="Stock *"
              type="number"
              placeholder="0"
              value={createForm.stock}
              onChange={handleFormChange("stock")}
            />
            <Input
              label="Categoría *"
              placeholder="electrónica"
              value={createForm.category}
              onChange={handleFormChange("category")}
            />
          </div>

          <Input
            label="URL de imagen (opcional)"
            placeholder="https://..."
            value={createForm.img}
            onChange={handleFormChange("img")}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="status"
              checked={createForm.status}
              onChange={handleFormChange("status")}
              className="rounded border-gray-300 dark:border-gray-600 accent-indigo-600"
            />
            <label htmlFor="status" className="text-sm text-gray-600 dark:text-gray-400">
              Producto activo
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setShowCreateModal(false); setCreateForm(emptyForm); }}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isCreating}>
              Crear producto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
