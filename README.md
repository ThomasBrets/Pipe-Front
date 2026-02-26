# Pipe — Frontend

Frontend de la tienda e-commerce **Pipe**, desarrollado con React 19 + Vite + Tailwind CSS 4. Consume la [API de Pipe](https://github.com/ThomasBrets/Pipe-api) desplegada en Render y está publicado en Vercel.

**Demo:** https://pipe-front.vercel.app

---

## Stack

| Tecnología | Rol |
|---|---|
| React 19 | UI |
| Vite 7 | Bundler / dev server |
| Tailwind CSS 4 | Estilos |
| React Router 7 | Ruteo SPA |
| Axios | Cliente HTTP |
| Framer Motion | Animaciones |
| Sileo | Notificaciones toast |
| Vercel | Deploy + proxy de API |

---

## Características

- Autenticación con **cookies HTTP-only** (sin tokens en el cliente)
- **Dark mode** persistente con Tailwind v4
- Carrito global con badge en tiempo real
- Panel de administración (usuarios y productos)
- Paginación client-side
- Lazy loading de páginas (code splitting automático)
- Responsive + fix de viewport para iOS Safari
- Error boundary global

---

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Landing | Público |
| `/auth/login` | Login | Público |
| `/auth/register` | Registro | Público |
| `/products` | Home — catálogo | Privado |
| `/users/products/:pid` | Detalle de producto | Privado |
| `/users/carts/:cid` | Carrito | Privado |
| `/profile` | Perfil de usuario | Privado |
| `/admin/users` | Gestión de usuarios | Admin |
| `/admin/products` | Gestión de productos | Admin |

---

## Instalación y uso local

```bash
# 1. Clonar el repo
git clone https://github.com/ThomasBrets/Pipe-Front.git
cd Pipe-Front

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
echo "VITE_BACK_URL=https://pipe-api.onrender.com/api" > .env

# 4. Levantar el servidor de desarrollo
npm run dev
```

> **Nota:** en desarrollo local las cookies cross-site pueden ser bloqueadas por Safari/ITP. Para pruebas completas usar Chrome o el entorno de producción en Vercel.

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # ESLint
```

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_BACK_URL` | URL base de la API | `https://pipe-api.onrender.com/api` |

---

## Arquitectura

### Estructura de carpetas

```
src/
├── components/        # Componentes reutilizables
│   └── ui/            # Componentes base (Button, Badge, Card, Input, Modal)
├── context/
│   └── userContext.jsx  # Estado global: usuario, productos y carrito
├── hooks/
│   ├── useAuth.js     # Login, logout, register
│   ├── useCart.js     # Operaciones del carrito
│   ├── useDarkMode.js # Toggle de dark mode
│   └── useDebounce.js # Debounce para búsqueda
├── pages/             # Páginas de la app (lazy loaded)
└── utils/
    ├── axios.js       # Instancia de Axios preconfigurada
    └── helper.js      # Utilidades (validateEmail, getInitials)
```

### Autenticación

El backend emite una **cookie de sesión HTTP-only** al hacer login. El cliente nunca manipula tokens — Axios está configurado con `withCredentials: true` para que el browser adjunte la cookie automáticamente en cada request.

### Proxy en producción

En Vercel se usa un proxy configurado en `vercel.json` que reescribe `/api/*` hacia `https://pipe-api.onrender.com/api/*`. Esto permite que el frontend y la API compartan el mismo dominio desde el punto de vista del browser, resolviendo el bloqueo de cookies cross-site en Safari (ITP).

---

## Backend

Repositorio de la API: [Pipe-api](https://github.com/ThomasBrets/Pipe-api) — desplegada en Render.
