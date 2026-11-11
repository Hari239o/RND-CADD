# Copilot instructions

## Project commands

Run commands from the repository root:

- `npm ci` installs the locked dependencies.
- `npm run dev` starts the Next.js development server.
- `npm run build` creates the production build.
- `npm start` serves the production build.
- `npm run lint` runs the configured Next.js lint command. To target a file, use `npm run lint -- app/page.tsx`.
- `npx tsc --noEmit` runs the TypeScript check.

There is no project test script or first-party test suite configured.

## Architecture

This is a Next.js 14 App Router application using React, TypeScript, and Tailwind CSS. Route pages and HTTP handlers live under `app/`; API endpoints use Next.js route handlers in `app/api/**/route.ts`. The landing page composes the shared sections in `components/`, while authentication and the student/admin portals have their own route pages.

There are two distinct course models and data sources:

- `lib/courses-data.ts` exports `COURSES` and `STREAMS` for the public course catalog and landing-page UI.
- `app/api/courses/route.ts` owns the LMS course shape and seeded catalog used by admin/student portals. It reads and writes MongoDB when available and serves seeded in-memory data as a fallback.

API handlers use `lib/mongodb.ts` for MongoDB connectivity. Shared service modules include `lib/cloudflare-r2.ts` for R2 storage operations and `lib/email.ts` for email dispatch. When changing a flow, trace both its UI caller and API handler; portal course/admin changes may also involve `/api/admin/students` and the `/api/courses` data contract.

## Codebase conventions

- Use the `@/*` alias for imports from the repository root. TypeScript strict mode is enabled.
- Pages and components that use React hooks, browser APIs, or client-side state must be client components (`'use client'`); keep server-renderable modules server-side where possible.
- Keep public marketing course data (`Course` from `lib/courses-data.ts`) distinct from the LMS `StoredCourse` data in the courses API. Do not assume their fields or IDs are interchangeable.
- The sign-in/sign-up UI stores the current user under `rnd_cadd_user` and role under `rnd_cadd_role` in `localStorage`; portal pages read this client-side state. Keep changes to authentication and portal access aligned across the UI and `/api/auth/*`.
- Use the existing Tailwind styling and shared palette in `tailwind.config.js`; global styles and shared CSS utilities are in `app/globals.css`.
- MongoDB connection settings are `MONGODB_URI` and `MONGODB_DB`; R2 settings are listed in `.env.example`. Email dispatch reads `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`. Keep real credentials in local environment configuration, not source files.

The root `README.md` is still the Vite starter template; use `package.json`, the Next.js configuration, and the `app/` source as the authoritative project description.
