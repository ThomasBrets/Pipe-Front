import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";
import { FaSearch, FaTrash, FaShieldAlt, FaUser, FaUsers } from "react-icons/fa";
import api from "../utils/axios";
import { useUser } from "../context/userContext";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";

const AdminUsers = () => {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // user object to delete
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || "No se pudieron cargar los usuarios";
      sileo.error({ title: "Error", description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/users/${deleteTarget._id}`);
      sileo.success({
        title: "Usuario eliminado",
        description: `${deleteTarget.first_name} ${deleteTarget.last_name} fue eliminado`,
      });
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.error || "No se pudo eliminar el usuario";
      sileo.error({ title: "Error al eliminar", description: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
            <FaUsers className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Panel de Administración
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestión de usuarios registrados
            </p>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Tabla / Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-400 animate-pulse">Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-24">
            <FaUsers className="text-5xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {search ? "No se encontraron usuarios" : "No hay usuarios registrados"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
            {/* Header de tabla */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <span className="col-span-4">Usuario</span>
              <span className="col-span-4">Email</span>
              <span className="col-span-2">Rol</span>
              <span className="col-span-2 text-right">Acciones</span>
            </div>

            {/* Filas */}
            <AnimatePresence>
              {filteredUsers.map((u, idx) => (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center ${
                    idx < filteredUsers.length - 1
                      ? "border-b dark:border-gray-700"
                      : ""
                  }`}
                >
                  {/* Nombre + avatar */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                      {u.first_name?.[0]}{u.last_name?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {u.first_name} {u.last_name}
                      </p>
                      {u.age && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {u.age} años
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {u.email}
                    </p>
                  </div>

                  {/* Rol */}
                  <div className="col-span-2">
                    <Badge variant={u.role === "admin" ? "warning" : "default"}>
                      {u.role === "admin" ? (
                        <span className="flex items-center gap-1">
                          <FaShieldAlt className="text-xs" /> Admin
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FaUser className="text-xs" /> User
                        </span>
                      )}
                    </Badge>
                  </div>

                  {/* Acción eliminar */}
                  <div className="col-span-2 flex justify-end">
                    {u._id !== currentUser?._id ? (
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer p-1"
                        title="Eliminar usuario"
                      >
                        <FaTrash />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-600 italic pr-1">
                        (vos)
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Contador */}
        {!loading && filteredUsers.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-right">
            {filteredUsers.length} usuario{filteredUsers.length !== 1 ? "s" : ""}
            {search && ` encontrados para "${search}"`}
          </p>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="¿Eliminar usuario?"
        size="sm"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Vas a eliminar a{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {deleteTarget?.first_name} {deleteTarget?.last_name}
          </span>
          . Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
