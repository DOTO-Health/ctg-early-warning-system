---
title: Getting Started
---

# Getting Started

This repo is an npm workspaces monorepo: `packages/core` (the classification engine) is a
workspace dependency of `apps/api`.

## Prerequisites

- Node.js ≥ 20
- npm

```bash
npm install npm@latest -g
```

## Install and build

```bash
git clone https://github.com/DOTO-Health/ctg-early-warning-system.git
cd ctg-early-warning-system
npm install

# apps/api depends on this being built first
npm run build --workspace=packages/core
```

## Run the API

```bash
cd apps/api
npm run start:dev
```

- API base: `http://localhost:3000/api`
- Interactive Swagger docs: `http://localhost:3000/api/docs`

## Run the web UI

In a second terminal:

```bash
cd apps/web
npm run dev
```

Open `http://localhost:5173?org=default`. The UI fetches its theme from
`GET /api/branding/default` and applies it as CSS custom properties — a different partner's
theme is just a different `?org=` slug, with no rebuild.

## Run the tests

```bash
# classification engine unit tests
cd packages/core && npm run build && node --test dist/strategies/strategies.spec.js

# API e2e tests (health, guidelines, classify-all, validation, branding)
cd apps/api && npm run test:e2e
```

These are the same checks that run in CI — see the
[Contributing Guide](https://github.com/DOTO-Health/ctg-early-warning-system/blob/main/CONTRIBUTING.md)
for the full pre-PR checklist.

[← Back to docs home](./index.html)