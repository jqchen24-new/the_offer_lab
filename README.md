# The Offer Lab

Web app to track study sessions, daily plans, and progress for interview prep. Built with Next.js (App Router), TypeScript, Tailwind, Prisma, and NextAuth.

## Screenshots

| Dashboard | Applications | Progress |
|-----------|--------------|----------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Applications](docs/screenshots/applications.png) | ![Progress](docs/screenshots/progress.png) |

## Features

- **Auth** – Sign in with Google or email/password. Onboarding flow for new users (track selection, default tags). Session is available in the nav on first load (including after redirect on mobile).
- **Dashboard** – Today’s upcoming sessions and progress at a glance (total time, this week, streak).
- **Daily plan** – Suggested sessions for today (based on least-practiced tags) and your scheduled tasks.
- **Tasks** – Study sessions with title, duration, scheduled date/time, and tags.
- **Applications** – Track job applications (company, role, status, date applied, notes, next step). Filter by status; status-updated date is recorded when you change status.
- **Progress** – Total time, this week’s time, streak, sessions completed, and time-by-tag chart (includes “Untagged” for completed tasks without tags).
- **Tags** – Default tags per track (e.g. SQL, ML, Stats, Python, Behavioral) plus any you add; all editable.
- **Settings** – Change your track and manage default tags.

## Run locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and fill in:

   - `DATABASE_URL` – PostgreSQL (e.g. [Neon](https://neon.tech) or local Postgres). Use `sslmode=require` for Neon.
   - `NEXTAUTH_SECRET` – Generate with `openssl rand -base64 32`.
   - `NEXTAUTH_URL` – `http://localhost:3000` for local dev.
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` – From [Google Cloud Console](https://console.cloud.google.com/apis/credentials) if you use Google sign-in.
   - `CONTACT_EMAIL` (optional) – Shown in the footer as “Email us”.

3. **Database**

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

   This applies migrations and seeds default tags for your track.

4. **Dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The root redirects to `/dashboard` (or `/onboarding` for new users).

## Production

- **Hosting** – Deploy to [Vercel](https://vercel.com) (or similar). Connect your repo and set the same env vars; set `NEXTAUTH_URL` to your production URL.
- **Database** – Use a Neon Postgres database and set `DATABASE_URL` in Vercel. Run `prisma migrate deploy` in the build step or via CI if needed; Vercel’s build runs `prisma generate` via `postinstall`.

## Scripts

| Command                  | Description                    |
|--------------------------|--------------------------------|
| `npm run dev`            | Start Next.js dev server       |
| `npm run build`          | Production build               |
| `npm run start`          | Start production server        |
| `npm run lint`           | Run ESLint                     |
| `npx prisma migrate dev` | Create/apply migrations (dev)  |
| `npx prisma migrate deploy` | Apply migrations (prod)    |
| `npx prisma db seed`     | Seed default tags              |

## Tech

- **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS**
- **Prisma** + **PostgreSQL** (e.g. Neon for local and production)
- **NextAuth** (Google OAuth, credentials, Prisma adapter)
- **Recharts** for the progress “time by tag” chart

## File structure (main)

- `prisma/schema.prisma` – User, Tag, Task, TaskTag, Application, Account, Session
- `src/app/` – Routes: `/`, `/signin`, `/signup`, `/onboarding`, `/dashboard`, `/plan`, `/tasks`, `/tasks/[id]`, `/applications`, `/applications/[id]`, `/progress`, `/tags`, `/settings`
- `src/components/` – Layout (Nav, PageContainer, Footer), providers (SessionProvider), OnboardingGate, tasks, plan, progress, applications, ui
- `src/lib/` – `auth`, `db`, `tags`, `tasks`, `progress`, `applications`, `profession-config`
