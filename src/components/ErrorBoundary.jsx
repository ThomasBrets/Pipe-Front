import { Component } from "react";

/**
 * ErrorBoundary: captura errores de JavaScript en el árbol de componentes hijos.
 *
 * Sin esto, un error en cualquier componente destruye toda la UI (pantalla blanca).
 * Con esto, se muestra una pantalla amigable con opción de recargar.
 *
 * Debe ser una clase (no hook) — es el único caso en React donde se requiere esto,
 * porque getDerivedStateFromError y componentDidCatch no tienen equivalente en hooks.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary capturó un error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 text-center">
          <p className="text-6xl mb-6">⚠️</p>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Algo salió mal
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
            Ocurrió un error inesperado. Intentá recargar la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
