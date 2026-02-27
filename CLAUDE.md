# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Architecture

React 19 + Vite + Tailwind CSS 4 frontend for an e-commerce app ("Pipe"). Connects to a backend at `VITE_BACK_URL` (default: `https://pipe-api.onrender.com/api`).

### Provider wrap order (main.jsx)
`StrictMode → BrowserRouter → UserProvider → App`

### Routing (App.jsx)
- `/` → `Home` (protected)
- `/users/products/:pid` → `ProductDetail` (protected)
- `/users/carts/:cid` → `Cart` (protected)
- `/auth/login` → `Login` (public)
- `/auth/register` → `Register` (public)

`PrivateRoute` wraps protected routes — it calls `/users/current` to verify the session, shows a spinner while loading, and redirects to `/auth/login` if unauthenticated.

### Global state (src/context/userContext.jsx)
`UserContext` holds `user`, `products`, `loading`, and `error`. On mount it:
1. Fetches `/users/current` to populate `user`
2. If a user exists, fetches `/users/products?limit=10` to populate `products`

Consume with the exported `useUser()` hook.

### HTTP client (src/utils/axios.js)
Pre-configured Axios instance: base URL from `VITE_BACK_URL`, 10 s timeout, `withCredentials: true` (session cookies), `Content-Type: application/json`. Import this instance everywhere instead of raw `axios`.

### Styling
Tailwind CSS 4 via `@tailwindcss/vite` plugin — no separate config file needed. Blue theme with gray backgrounds (`bg-gray-100`). Responsive grid in `Home`: 1 col on mobile, 2 cols on md+.

### Key utilities (src/utils/helper.js)
- `validateEmail(email)` — regex email check
- `getInitials(firstName, lastName)` — used in `Navbar` avatar circle

## Environment
`.env` must define `VITE_BACK_URL`. The file is gitignored; copy the default value `https://pipe-api.onrender.com/api` when setting up locally.
