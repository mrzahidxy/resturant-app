<INSTRUCTIONS>
You are a coding agent working in this repository. Use this file as the project-specific coding and maintenance guide for any change (bug fixes, features, refactors, debugging, reviews, docs, and migrations).

## Primary objective
- Make concrete code changes in this repository (not just advice) whenever the user asks for fixes, features, refactors, or maintenance.
- Prefer small, reviewable patches and verify impacted behavior after edits.
- Preserve existing product behavior unless the request explicitly asks for a functional change.

## Non-negotiable constraints
- Use App Router only. No Pages Router, no hybrid mode.
- Pin exact dependency versions (no ^ or ~) in production dependencies.
- Versions must include: next@14.2.3, react@18.2.0, react-dom@18.2.0, @vercel/og@1.0.0, sharp@0.32.6, eslint-config-next@14.2.3.
- Use next/font (public) for fonts.
- Add `generateStaticParams` for dynamic routes when the route is intended to be statically generated.
- For App Router `fetch`, specify caching behavior intentionally (`next: { revalidate }` or `cache`) instead of relying on accidental defaults.
- Turbopack-ready config required. next.config.mjs must include:
  experimental: {
    turbo: {
      rules: { "*.svg": ["@vercel/og/svg", { runtime: "nodejs" }] }
    }
  }

## Codex agentic workflow (required)
- Inspect before editing: read the relevant files and search for usage sites before patching.
- Prefer `rg`/`rg --files` for search.
- Make minimal changes first; avoid broad refactors unless requested.
- Use `apply_patch` for focused edits when practical.
- Do not revert unrelated user changes.
- After changes, run the smallest useful verification step (typecheck/lint/build/test for impacted area) when possible.
- If a command cannot be run (missing deps, sandbox/network restrictions), state exactly what was not verified.
- Call out assumptions clearly when the request is ambiguous, but continue with the most likely path.

## Coding style and maintenance expectations
- Match the existing code style in the touched file (quote style, semicolons, import order, naming).
- Prefer consistency with local patterns over introducing a new pattern.
- This project is currently MVP-focused: prefer the simplest implementation that solves the problem reliably.
- Avoid over-engineering (extra abstractions, premature optimization, generic frameworks, complex patterns) unless there is a clear current need.
- Favor direct, readable code over highly configurable or extensible designs when shipping MVP features/fixes.
- Keep components focused; avoid large mixed UI/data/business-logic changes in one file unless necessary.
- Reuse existing utilities (`src/lib/api.ts`, `src/utils/*`, providers, shared components) before adding new abstractions.
- Keep TypeScript types explicit at boundaries (API payloads, component props, utility return values).
- Avoid `any` unless unavoidable; prefer narrowing and existing Prisma/local types.
- Add comments only where logic is non-obvious; avoid redundant comments.
- Preserve public behavior and route contracts unless the user requests a breaking change.
- When fixing bugs, patch root cause where feasible, not only the visible symptom.

## Repository-specific implementation guidance
- Keep Prisma changes compatible with current installed versions unless upgrading dependencies is part of the request.
- Prisma 7+ is already in use:
  - `prisma/schema.prisma` should not include datasource `url`
  - `prisma.config.ts` owns migrate datasource URL config
  - `src/utils/connect.ts` uses `PrismaClient({ adapter })` with `@prisma/adapter-pg`
- Keep server/client boundaries correct in App Router (`'use client'` only where required).
- Preserve existing route groups and segment structure under `src/app`.
- Prefer `next/image`, `next/link`, and `next/font` where applicable.

## Current project alignment (important)
- Stack in this repo:
  - Next.js `14.2.3` App Router
  - React `18.2.0`
  - Prisma `7.0.0` + PostgreSQL (`@prisma/adapter-pg`, `pg`)
  - NextAuth (`src/app/api/auth/[...nextauth]/route.ts`, `src/utils/auth.ts`)
  - Stripe payment intent flow (`src/app/api/(checkout)/*`)
  - TanStack Query provider (`src/components/QueryProvider.tsx`)
  - Cloudinary utilities in `src/utils/cloudinary*.ts`
- Route groups already in use:
  - `src/app/(root)` for storefront pages
  - `src/app/(admin)/admin` for admin UI
  - `src/app/api` for route handlers
- Existing dynamic routes (examples):
  - `src/app/(root)/product/[id]/page.tsx`
  - `src/app/(root)/pay/[id]/page.tsx`
  - `src/app/(root)/menu/[category]/page.tsx`
- Prisma client singleton lives at `src/utils/connect.ts`; reuse it instead of creating new client instances.
- Auth helpers/config live in `src/utils/auth.ts`; extend existing callbacks/types rather than duplicating auth setup.
- Use existing typed models from Prisma and local types under `src/types/*` when adding UI/data code.

## next.config.mjs expectations (project-specific)
- `next.config.mjs` already contains a Turbopack SVG rule using the object form (`loaders` + `as`).
- Do not replace it with a different syntax unless necessary; preserve the working config shape and only patch incrementally.
- Preserve Cloudinary image domain allowlist in `images.domains`.

## Data fetching and mutations in this repo
- Route handlers are under `src/app/api/**/route.ts`; prefer extending these for server mutations.
- Frontend data access is commonly centralized in `src/lib/api.ts`; reuse existing request helpers before adding new fetch wrappers.
- For App Router server-side `fetch`, set caching/revalidation intentionally (`next: { revalidate }` or `cache`).
- For client-side async flows already using React Query, follow the existing provider pattern instead of introducing a second state/data library.

## Prisma + DB notes for Codex
- `prisma/schema.prisma` should not contain datasource `url` (Prisma 7 migration already applied).
- `prisma.config.ts` is the source of migration datasource URL config.
- When editing DB access, avoid breaking NextAuth adapter compatibility (`PrismaAdapter(prisma)` in `src/utils/auth.ts`).
- After Prisma-related changes, prefer verifying with `npx prisma generate` before build/lint.

## Safe editing rules
- Do not use Pages Router APIs (`getStaticProps`, `getServerSideProps`, `getInitialProps`).
- Do not introduce hybrid routing.
- Do not loosen exact version pins in production dependencies.
- Do not perform destructive git operations (`reset --hard`, checkout/revert unrelated files) unless explicitly requested.

## Response requirements
- Be concise and action-oriented.
- Summarize what changed and why.
- Include file references for modified files.
- For dependency or config changes, include exact versions and commands the user should run.
- For code review requests, list findings first (bugs/regressions/risks), then summary.
- Never suggest Pages Router APIs (`getStaticProps`, `getServerSideProps`) for this repo.

## Optional response extras (use when relevant)
- Folder structure diff (for file adds/removes/moves)
- Conversion snippet (for migrations/refactors)
- Pinned dependency snippet (for dependency changes)
- Build/test command snippet (for verification steps)

## Preferred verification commands
- Install deps: `npm install`
- Prisma client: `npx prisma generate`
- Lint: `npm run lint`
- Build: `npm run build`
- Dev: `npm run dev`
- Dev (Turbopack optional): `next dev --turbo`
</INSTRUCTIONS>
