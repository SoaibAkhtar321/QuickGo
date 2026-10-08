# Vite → Next.js Migration

## Original architecture
Vite + React + TypeScript SPA. `index.html` → `src/main.tsx` → `src/App.tsx`.
There is **no URL router**: all navigation is in-memory state inside `App.tsx`
(role + per-role tab/sub-view state). A partial Next.js migration had already
added `src/app/layout.tsx`, `src/app/page.tsx`, `next.config.ts`, and Next scripts,
but the repo was left broken (see "Problems found").

## Current architecture
Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4 (`@tailwindcss/postcss`).
- `src/app/layout.tsx` – root layout, metadata (migrated from `index.html`), Google Fonts links, body classes.
- `src/app/page.tsx` – server component rendering `<App />` for `/`.
- `src/App.tsx` – `"use client"`; unchanged app controller wrapped in `AppProvider`.
- `src/store/AppContext.tsx` – `"use client"`; unchanged (localStorage already guarded with `typeof window` + try/catch).

## Routes migrated
Only `/`. The prototype never had URL routes; role/tab/sub-view navigation stays
as client state exactly as before. No routes were invented.

## Problems found and fixed
1. `src/App.tsx` imported `./views/*` but the folder was `src/pages/` → build could not resolve imports.
   Also, `src/pages` is reserved by Next.js (Pages Router). Renamed `src/pages` → `src/views` (git mv, history kept).
2. `src/app/layout.tsx` used `React.ReactNode` without importing React → TS error. Now imports `ReactNode` type.
3. `src/index.css` was a byte-identical duplicate of `src/app/globals.css` and unreferenced → removed.

## Files
- Created: `docs/VITE_TO_NEXTJS_MIGRATION.md`
- Renamed: `src/pages/**` → `src/views/**`
- Modified: `src/app/layout.tsx`, `package.json`, `package-lock.json`, `.gitignore`
- Removed: `src/index.css`, `bun.lock`
- Already absent from the repo at start: `vite.config.ts`, root `index.html`, `src/main.tsx`

## Dependencies
- Vite packages (`vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`): already absent from `package.json`.
- Removed because nothing in `src/` imports them: `express`, `@types/express`, `dotenv`, `esbuild`, `tsx`, `@google/genai`, `autoprefixer`.
- Retained: `next`, `react`, `react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `lucide-react`, `motion`, `canvas-confetti`, `@types/*`, `typescript`.
- Added by Next on first build: `@types/react` (dev).
- Package manager: npm (scripts and `package-lock.json`). `bun.lock` was stale/conflicting and was removed.

## Environment variables
No `import.meta.env` or `VITE_*` usage exists in the code. `.env.example` still lists
`GEMINI_API_KEY` and `APP_URL` from the AI Studio template; nothing reads them today.
If Gemini is added later it must be called server-side (route handler), never via `NEXT_PUBLIC_*`.

## Client/server decisions
Only `App.tsx` and `store/AppContext.tsx` carry `"use client"`. Every other component
is imported from that client boundary, so it runs as client code without its own directive.
`layout.tsx` and `page.tsx` are server components.

## Known prototype limitations
- No backend, auth, payments, or persistence beyond browser localStorage.
- Single route: no deep links to a role/tab/order.
- `AppProvider` reads localStorage in `useState` initialisers; with saved state, the first client render can differ from the server HTML (possible hydration warning).
- `strict` is `false` in `tsconfig.json` (pre-existing).
- 2 remaining `npm audit` findings need `--force` (breaking) upgrades.
