/**
 * Componentes de skeleton loading.
 *
 * Los skeletons muestran la FORMA del contenido antes de que los datos lleguen.
 * Esto reduce el salto visual del layout al cargar — si usáramos un spinner
 * central, el grid de productos aparecería de repente y todo "saltaría" de lugar.
 *
 * Usamos animate-pulse de Tailwind en lugar de keyframes personalizados porque:
 * 1. Está optimizado para rendimiento (usa opacity, no transforms)
 * 2. Es consistente con el resto del sistema de diseño
 * 3. Requiere cero configuración extra
 */

/**
 * Skeleton de una card de producto individual.
 * Imita la estructura real: imagen arriba, título, categoría+precio, botón.
 */
export const ProductSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl overflow-hidden animate-pulse">
    {/* Imagen placeholder */}
    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      {/* Título */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
      {/* Categoría + precio */}
      <div className="flex justify-center gap-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
      {/* Botón */}
      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
    </div>
  </div>
);

/**
 * Grid completo de skeletons — mismo layout que el grid de productos real.
 * Acepta `count` para mostrar la cantidad correcta de placeholders
 * (idealmente la misma que el límite de la API).
 */
const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="max-w-7xl mx-auto py-8 px-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default ProductGridSkeleton;
