import { clsx } from "clsx";

/**
 * Badge reutilizable para categorías, estados y etiquetas.
 *
 * Usamos bg-color-900/30 en dark mode (con opacidad) en lugar de colores
 * sólidos oscuros para mantener legibilidad y contraste en ambos temas.
 * El /30 significa 30% de opacidad del color base.
 */

const variantStyles = {
  default: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
  success:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  warning:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  danger: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  info: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

const Badge = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
