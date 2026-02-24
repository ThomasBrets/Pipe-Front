import { clsx } from "clsx";

/**
 * Card reutilizable para contenedores de contenido.
 *
 * Acepta `children` en lugar de una prop `content` porque:
 * 1. Es el patrón estándar de React — el padre controla la estructura interna
 * 2. Permite composición libre (cualquier JSX adentro)
 * 3. Es más flexible que pasar un string o elemento específico
 *
 * El prop `hover` es opcional porque no siempre queremos elevación en hover
 * (ej: en un formulario no tiene sentido hacer hover effect).
 */

const Card = ({
  children,
  className = "",
  hover = false,
  padding = "p-6",
}) => {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm",
        hover && "hover:shadow-md transition-shadow duration-300",
        padding,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
