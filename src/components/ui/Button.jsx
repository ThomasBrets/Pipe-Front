import { clsx } from "clsx";

/**
 * Botón reutilizable con variantes, tamaños y estado de loading.
 *
 * Usamos un objeto de variantes en lugar de if/else encadenados para:
 * 1. Escalar fácilmente (agregar variante = agregar una línea)
 * 2. Separar los estilos de la lógica
 * 3. Facilitar code splitting por variante en el futuro
 *
 * Props spreading (...props) permite pasar onClick, type, form, etc.
 * sin declararlos explícitamente — el componente es agnóstico al contexto.
 */

const variantStyles = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
  secondary:
    "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  // ghost: sin fondo, solo hover sutil — ideal para acciones secundarias
  ghost:
    "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      // Deshabilitar durante loading para evitar requests duplicados
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        (disabled || isLoading) && "opacity-60 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          {/* Spinner SVG inline para evitar dependencia de librería de iconos */}
          <svg
            className="animate-spin -ml-0.5 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
