import { forwardRef } from "react";
import { clsx } from "clsx";

/**
 * Componente Input reutilizable con label, iconos y estado de error.
 *
 * Usamos forwardRef para que el componente padre pueda acceder al DOM input
 * directamente. Esto es necesario para:
 * - Foco programático (ej: al abrir un modal, enfocar el primer campo)
 * - Integración con librerías de validación (react-hook-form, Formik)
 * - Accesibilidad (desplazar a la vista al validar)
 *
 * El spread de props (...props) transfiere cualquier atributo HTML nativo
 * (onChange, onBlur, name, autocomplete, etc.) sin declararlos uno por uno.
 * Esto hace el componente compatible con cualquier caso de uso futuro.
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,       // Icono izquierdo (componente react-icons)
      rightIcon: RightIcon, // Icono derecho clickeable (ej: show/hide password)
      onRightIconClick,
      type = "text",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {/* Label: solo se renderiza si se pasa la prop */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {/* Icono izquierdo: pointer-events-none para no bloquear clicks al input */}
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="text-gray-400 dark:text-gray-500 text-sm" />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={clsx(
              "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors duration-200",
              "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
              "placeholder-gray-400 dark:placeholder-gray-500",
              // Ring al hacer focus — usa indigo por defecto, rojo si hay error
              "focus:ring-2 focus:border-transparent",
              Icon && "pl-9",       // Desplazo texto si hay icono izquierdo
              RightIcon && "pr-9",  // Desplazo texto si hay icono derecho
              error
                ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500",
              className
            )}
            {...props}
          />

          {/* Icono derecho clickeable — tipicamente para show/hide password */}
          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <RightIcon className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors" />
            </button>
          )}
        </div>

        {/* Mensaje de error: solo aparece cuando el campo fue tocado y hay error */}
        {error && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
