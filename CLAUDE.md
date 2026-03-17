# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm start` / `ng serve` - Start dev server (default: http://localhost:4200)
- `npm run build` - Production build (output: `www/`)
- `npm run watch` - Build in watch mode (development config)
- `npm test` - Run unit tests (Karma + Jasmine)
- `npm run lint` - Run ESLint (`@angular-eslint/builder`)

## Tech Stack

- **Angular 20** with **Ionic 8** (Capacitor 8 for native)
- NgModule-based architecture (not standalone components — all components use `standalone: false`)
- CSS for styles (not SCSS — the project migrated from SCSS to plain CSS)
- TypeScript strict mode enabled with strict Angular templates
- Tests: Karma + Jasmine (spec files colocated with components)
- Linting: ESLint via `.eslintrc.json`

## Architecture

### Routing

Routes are defined in two layers:
1. `app-routing.module.ts` — Top-level routes: `/login` (public) and everything else (guarded by `authGuard`)
2. `tabs/tabs-routing.module.ts` — Tab-level child routes under the tab shell

Route paths are centralized as constants in `app.routes.constants.ts` (`ROUTE_PATH_*` for path segments, `ROUTE_URL_*` for absolute URLs). Always use these constants instead of hardcoded strings.

All feature pages are lazy-loaded via `loadChildren`.

### Authentication

- `AuthService` (`services/auth.ts`) — In-memory mock auth with `BehaviorSubject<User | null>`. Credentials: `demo/demo` or `admin/admin`.
- `authGuard` (`guards/auth.guard.ts`) — Functional `CanActivateFn` guard that redirects to login with `returnUrl` query param.

### Services

Services are `providedIn: 'root'` singletons:
- `TaskService` (`services/task.ts`) — In-memory CRUD for tasks using `BehaviorSubject`. All data access returns `Observable<T>`.
- `ApiDemoService` (`services/api-demo.ts`) — HTTP client hitting `jsonplaceholder.typicode.com` for REST demo.
- `Logger` (`services/logger.ts`) — Simple logging wrapper used across services.

### Page Structure

Pages live under `src/app/pages/`, each with its own NgModule:
- `home` — Landing page
- `login` — Auth page (unguarded)
- `dashboard` — User dashboard
- `task-list`, `task-detail`, `task-form` — Task CRUD pages
- `about` — Info page
- `api-demo` — HTTP/REST demonstration

### Models

- `Task` interface and `TaskPriority` enum in `models/task.model.ts`
- `User` interface in `services/auth.ts`

### Tabs

The app uses Ionic's tab bar (`tabs/tabs.page.html`) with 5 tabs: Home, Tasks, API Demo, Dashboard, About. The `TabsPage` component hosts `ion-router-outlet`.
