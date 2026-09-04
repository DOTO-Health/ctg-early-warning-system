---
title: Architecture
---

# Architecture

High-level map of the codebase. For the full write-up (versioning of classification rules,
multi-tenant branding internals, persistence plan), see
[ARCHITECTURE.md](https://github.com/DOTO-Health/ctg-early-warning-system/blob/main/ARCHITECTURE.md)
in the repo root.

## Workspaces

| Package | Role |
| --- | --- |
| `packages/core` | Framework-agnostic TypeScript classification engine. Pluggable strategies: `FIGO`, `NICE`, `ACOG`. Portable — reusable in a CLI, batch job, or embedded elsewhere. |
| `apps/api` | NestJS backend. One module per guideline strategy, Swagger/OpenAPI at `/api/docs`. `traces/` and `branding/` are currently in-memory reference stores, clearly marked in source, pending a Postgres/Prisma swap. |
| `apps/web` | HTML + Tailwind v4 UI (Alpine.js for light interactivity), served by a zero-dependency static server for local dev. |

## Request flow

1. CTG features (baseline FHR, variability, accelerations, decelerations, contraction frequency)
   are submitted via the intake form or the API directly.
2. `apps/api`'s classification module dispatches the feature set to each enabled guideline
   strategy in `packages/core`.
3. `POST /api/classification/all` returns one classification per guideline side by side.

## Multi-tenant branding

Each organization's theme (primary/accent colors, logo) is stored in the `branding` module and
injected at render time as CSS custom properties (`--brand-primary`, `--brand-accent`). The same
compiled CSS serves every partner — a different tenant is just a different `?org=` slug against
`GET /api/branding/:orgSlug`, no rebuild required.

## Why NestJS

Three (and growing) independent classification strategies, a multi-tenant branding layer, and a
public-facing API that partners will integrate against — Nest's modules/providers/guards give
that structure for free. A plain Express + manual `strategies/` folder is a valid lighter-weight
alternative if the team stays small.

[← Back to docs home](./index.html)