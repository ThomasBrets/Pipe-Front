import { useState } from "react";
import { motion } from "framer-motion";
import { sileo } from "sileo";
import { FaUser, FaEnvelope, FaCalendarAlt, FaShieldAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import api from "../utils/axios";
import { useUser } from "../context/userContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const Profile = () => {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    age: user?.age?.toString() || "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim()) {
      sileo.error({ title: "Completá nombre y apellido" });
      return;
    }
    if (Number(form.age) < 18) {
      sileo.error({ title: "Debés ser mayor de 18 años" });
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.put("/users/current", {
        first_name: form.first_name,
        last_name: form.last_name,
        age: Number(form.age),
      });
      // Actualizar user en context para que Navbar refleje el nuevo nombre
      setUser((prev) => ({ ...prev, ...res.data }));
      sileo.success({ title: "Perfil actualizado" });
      setIsEditing(false);
    } catch (err) {
      const msg = err.response?.data?.error || "No se pudo actualizar el perfil";
      sileo.error({ title: "Error al guardar", description: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      age: user?.age?.toString() || "",
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-indigo-200 dark:text-gray-300 text-sm mt-0.5">
                  {user.email}
                </p>
                <div className="mt-2">
                  <Badge variant={user.role === "admin" ? "warning" : "info"}>
                    {user.role === "admin" ? "Administrador" : "Usuario"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Card de datos */}
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Información personal
              </h2>
              {!isEditing && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="mr-1.5" />
                  Editar
                </Button>
              )}
            </div>

            {isEditing ? (
              /* ── Formulario de edición ── */
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    value={form.first_name}
                    onChange={handleChange("first_name")}
                    icon={FaUser}
                  />
                  <Input
                    label="Apellido"
                    value={form.last_name}
                    onChange={handleChange("last_name")}
                    icon={FaUser}
                  />
                </div>

                <Input
                  label="Edad"
                  type="number"
                  value={form.age}
                  onChange={handleChange("age")}
                  icon={FaCalendarAlt}
                />

                {/* Email y rol son de solo lectura */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Campos no editables
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FaEnvelope className="text-gray-400 dark:text-gray-500 shrink-0" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FaShieldAlt className="text-gray-400 dark:text-gray-500 shrink-0" />
                    Rol: {user.role}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    isLoading={isSaving}
                    disabled={isSaving}
                    size="md"
                  >
                    <FaSave className="mr-1.5" />
                    Guardar cambios
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <FaTimes className="mr-1.5" />
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              /* ── Vista de solo lectura ── */
              <dl className="space-y-4">
                {[
                  { icon: FaUser, label: "Nombre", value: `${user.first_name} ${user.last_name}` },
                  { icon: FaEnvelope, label: "Email", value: user.email },
                  { icon: FaCalendarAlt, label: "Edad", value: user.age ? `${user.age} años` : "—" },
                  { icon: FaShieldAlt, label: "Rol", value: user.role === "admin" ? "Administrador" : "Usuario" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <dt className="flex items-center gap-2 w-28 shrink-0 text-sm text-gray-500 dark:text-gray-400">
                      <Icon className="text-xs" />
                      {label}
                    </dt>
                    <dd className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
