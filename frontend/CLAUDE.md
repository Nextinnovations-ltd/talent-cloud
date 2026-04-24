# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Dev server on 0.0.0.0:5173
npm run build         # Type-check + production build
npm run build:staging # Build targeting staging env
npm run lint          # ESLint
npm run preview       # Preview production build locally
```

No test runner is configured.

## Architecture

React 18 + TypeScript + Vite SPA. Two user roles: **job seeker** and **admin**.

### State Management — two layers

**Server state → RTK Query**
`src/services/api/apiSlice.ts` — single base API slice. All feature endpoints injected via `apiSlice.injectEndpoints(...)` in their slice files (`src/services/slices/`). Never call `createApi` again — always inject into the existing base slice.

**Client/UI state → Zustand**
`src/state/zustand/` — five active stores:

- `auth-store.ts` — token, isAuthenticated, email (persisted)
- `preference.ts` — selectedLanguage (persisted)
- `global-modal.ts` — modal open/close
- `job-search.ts` — search filters
- `create-job-store.ts` — multi-step job creation

### Auth & Token Storage

Token lives in **`localStorage`** (`keepMeLoggedIn=true`) or **`sessionStorage`** (session only). Redux `authSlice` holds a runtime copy. Always use `src/helpers/operateBrowserStorage.ts` for read/write/remove operations — never access storage directly.

**Auto-reauth flow** (in `apiSlice.ts`):

1. Any request returns `403` + `message: "Unauthenticated"`
2. Hits `POST /auth/refresh-token/`
3. On success: dispatches `setReauthToken`, retries original request
4. On failure: clears tokens, dispatches `revertAll`, redirects to `/auth/login`

### Routing & Route Guards

Routes defined in `src/router.tsx`. Always reference path strings from `src/constants/routesMap.ts` (job seeker) or `src/constants/adminRoutesMap.ts` (admin) — never hardcode path strings in components.

**`VerifyToken`** (`src/components/common/VerifyToken.tsx`) — Outlet wrapper used on protected routes. After fetching user info it routes based on:

- `role === SUPERADMIN` → `/admin/dashboard`
- `is_generated_username === true` → `/verify`
- `onboarding_step` 1 → `/verify/userwelcome`
- `onboarding_step` 2–4 → `/verify/userwelcome?step=N+1`
- `onboarding_step` 5/6 → home

**`VerifyRoleAndToken`** — same as above but enforces admin role. Wraps all `/admin/*` routes.

Route layout groups:

- `/emp/lp`, `/tc/lp` — public landing pages
- `/auth/*` — auth flows (AuthLayout)
- `/` (MainLayout + VerifyToken) — job seeker app
- `/user/edit/*` — profile editing (ProfileNavSideBar layout)
- `/admin/dashboard/*` — admin panel (AdminLayout + VerifyRoleAndToken)
- `/oauth/callback` — OAuth token parsing (Google, LinkedIn, Facebook)

### API & Environments

URLs injected via Vite `define` globals — use these in new code:

- `__API_BASE_URL__` — REST base URL
- `__WS_BASE_NOTIFICATION_URL__` — WebSocket URL
- `__GOOGLLE_CALL_BACK_URL_`, `__LINKEDIN_CALL_BACK_URL_`, `__FACEBOOK_CALLL_BACK_URL_`

> ⚠️ `src/services/api/apiurls.ts` hardcodes the staging URL. Do not use that export in new code — use `__API_BASE_URL__` instead.

Environments (set via `--mode` flag):

- **dev** (default): `http://localhost:8000/api/v1/`
- **staging**: `https://staging.talent-cloud.asia/api/v1/`

### UI Layer

shadcn/ui components (`src/components/ui/`) built on Radix UI primitives. Tailwind CSS. Path alias `@` → `src/`.

Shared components in `src/components/common/` — reusable across job seeker and admin contexts.

### i18n

`src/i18n.ts` — i18next + react-i18next. Languages: `en`, `mm` (Myanmar/Burmese). Namespaced JSON files in `src/locales/{en,mm}/`. Active language persisted in Zustand `PreferenceStore`.

### Domain Areas

- **Job Seeker**: Home → Browse Jobs → Apply → Profile (skills, experience, education, resume, video intro)
- **Admin**: Candidates → Jobs (all/active/expired/create) → Analytics → Push Notifications
- **Landing Pages**: Job Seeker LP, Employee/Company LP, Contact, Privacy, Terms
- **Onboarding**: SignUp → Email Verify → Create Username → Multi-step profile wizard (steps 1–5)

### Key Dependencies

- **Forms**: `react-hook-form`, `yup`, `zod`
- **UI**: `@radix-ui/*`, `lucide-react`, `@tabler/icons-react`
- **Charts/Data**: `recharts`, `react-window`
- **Animations**: `framer-motion`, `gsap`, `canvas-confetti`
- **File Upload**: `browser-image-compression`, `react-dropzone`
- **Notifications**: `sonner` (toast), WebSocket for real-time
- **i18n**: `i18next`, `react-i18next`
