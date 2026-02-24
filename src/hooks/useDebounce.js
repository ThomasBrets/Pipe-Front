import { useState, useEffect } from "react";

/**
 * Hook de debounce: retrasa la actualización de un valor hasta que el usuario
 * deja de cambiarlo por `delay` milisegundos.
 *
 * Problema que resuelve:
 * Sin debounce, un input de búsqueda con 200 productos haría un filtrado
 * en cada tecla presionada (potencialmente 10+ renders por segundo).
 * Con debounce de 300ms, solo filtra cuando el usuario "termina" de escribir.
 *
 * Cómo funciona internamente:
 * 1. Cada vez que `value` cambia, se crea un setTimeout de `delay` ms
 * 2. El cleanup del useEffect cancela el timeout anterior si `value` vuelve a cambiar
 * 3. Solo cuando el timeout expira (usuario no escribió por `delay` ms) se
 *    actualiza `debouncedValue`
 *
 * @param {any} value - El valor a hacer debounce (típicamente un string de búsqueda)
 * @param {number} delay - Milisegundos a esperar sin cambios antes de actualizar (default: 300ms)
 * @returns {any} El valor debounceado
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Crear timer — solo actualizará el valor si no hay más cambios en `delay` ms
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancela el timer si `value` cambia antes de que expire.
    // Este es el mecanismo central del debounce.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
