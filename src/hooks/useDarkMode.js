import { useState, useEffect } from "react";

/**
 * Custom hook para manejar dark mode.
 * - Lee la preferencia guardada en localStorage
 * - Si no hay preferencia, usa la del sistema operativo
 * - Aplica/remueve la clase 'dark' en <html>
 * - Persiste la preferencia en localStorage
 */
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  //   **¿Qué hace?**
  // 1. **localStorage.getItem("theme")**: Lee si guardaste "dark" o "light" antes
  // 2. **Si NO hay nada guardado**: Pregunta al sistema operativo si tiene dark mode
  // 3. **window.matchMedia()**: API del navegador que detecta preferencia del OS
  
  // **Ejemplo:**
  // ```
  // Usuario nunca usó tu app:
  // → localStorage.getItem("theme") → null
  // → Sistema operativo tiene dark mode activado
  // → isDark = true (empieza en dark mode)
  
  // Usuario ya usó tu app y eligió light:
  // → localStorage.getItem("theme") → "light"
  // → isDark = false (ignora preferencia del OS)



  useEffect(() => {
    const root = document.documentElement; // <html>
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");  // <html class="dark">
    } else {
      root.classList.remove("dark");   // <html class="">
      localStorage.setItem("theme", "light");
    }
  }, [isDark]); // Se ejecuta cada vez que isDark cambia

  const toggle = () => setIsDark((prev) => !prev);

  return [isDark, toggle];
};

// **¿Qué hace?**
// 1. **document.documentElement**: Es el elemento `<html>`
// 2. **Agrega/quita clase "dark"**: Tailwind usa esto para aplicar estilos dark
// 3. **Guarda en localStorage**: Para que persista entre sesiones

// **Flujo completo:**
// ```
// Usuario hace click en el toggle de dark mode:
// 1. setIsDark(true)
// 2. useEffect se ejecuta porque isDark cambió
// 3. Agrega class="dark" al <html>
// 4. Tailwind ve la clase y aplica dark:bg-gray-900 etc.
// 5. Guarda "dark" en localStorage
// 6. La próxima vez que abra la app, empieza en dark mode