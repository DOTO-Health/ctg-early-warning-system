<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Work in Progress](https://img.shields.io/badge/status-work--in--progress-yellow.svg?style=for-the-badge)](https://github.com/DOTO-Health/ctg-early-warning-system)
[![CI](https://img.shields.io/github/actions/workflow/status/DOTO-Health/ctg-early-warning-system/ci.yml?branch=main&style=for-the-badge&label=CI)](./.github/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg?style=for-the-badge)](./LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge)](./CODE_OF_CONDUCT.md)
[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Open Issues](https://img.shields.io/github/issues/DOTO-Health/ctg-early-warning-system.svg?style=for-the-badge)](https://github.com/DOTO-Health/ctg-early-warning-system/issues)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/DOTO-Health/ctg-early-warning-system">
    <img src="./assets/logo-wordmark.svg" alt="Ctg-Early-Warning-System" width="280">
  </a>

  <h3 align="center">Ctg - Early Warning System</h3>

  <p align="center">
    Open-source, multi-guideline CTG (Cardiotocography) interpretation platform.
    <br />
    Auto-classify fetal heart rate traces against <strong>FIGO</strong>, <strong>NICE</strong>, and <strong>ACOG</strong> guidelines — side by side, in real time.
    <br />
    <br />
    <a href="./ARCHITECTURE.md"><strong>Explore the architecture docs »</strong></a>
    <br />
    <br />
    <a href="./PROJECT_CHARTER.md">Project Charter</a>
     &middot;
    <a href="https://DOTO-Health.github.io/ctg-early-warning-system/">Developer Docs</a>
    &middot;
    <a href="http://localhost:5173">View Demo</a>
    &middot;
    <a href="https://github.com/DOTO-Health/ctg-early-warning-system/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/DOTO-Health/ctg-early-warning-system/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

> ⚠️ **Clinical disclaimer:** This software is a decision-support and educational tool. It does not replace clinical judgement, and it is not a certified medical device unless independently validated and cleared for your jurisdiction. See [DISCLAIMER.md](./DISCLAIMER.md).

## Project Status

**Pre-release — work in progress.**

- ✅ Implemented — classification engine (`packages/core`: FIGO, NICE, ACOG strategies), REST API (`apps/api`, NestJS, Swagger docs), web UI (`apps/web`), multi-tenant branding, CI (build + lint + test on every PR)
- 🟡 Work in progress — see the [Roadmap](#roadmap) for specifics

> Persistence (e.g. Prisma/PostgreSQL) and authentication are intentionally **not** part of the
> open-source core — `apps/api`'s traces/branding stores are deliberately in-memory reference
> implementations. Deployers who need persistence or auth add them as an extension layer on top
> of this project.

See the [Roadmap](#roadmap) for the fuller list and [OPEN_SOURCE_CHECKLIST.md](./OPEN_SOURCE_CHECKLIST.md) for open-source readiness status.

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#core-capabilities">Core Capabilities</a></li>
        <li><a href="#tech-stack">Tech Stack</a></li>
        <li><a href="#brand-system-default-theme">Brand System</a></li>
      </ul>
    </li>
    <li>
      <a href="#project-structure">Project Structure</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#running-tests">Running Tests</a></li>
      </ul>
    </li>
    <li><a href="#api-usage-example">API Usage Example</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

---

## About The Project

Ctg-Early-Warning-System takes structured CTG features (baseline FHR, variability, accelerations, decelerations, contraction frequency, etc.) — extracted from a monitor, an upload, or entered via form — and classifies the trace against **multiple clinical guidelines at once**, instead of forcing a clinician to pick just one system.

This project re-platforms established FIGO/NICE/ACOG classification logic as a **web-based, brandable, multi-tenant service**, so hospitals, clinics, and monitoring device vendors can white-label it under their own name and a partner's logo.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Core Capabilities

- 📋 Structured intake form for CTG features (or programmatic ingestion via API)
- 🧠 Guideline engine with pluggable strategies: `FIGO`, `NICE`, `ACOG` (extensible to new guidelines)
- 🔀 "Compare all guidelines" view — run all three classifiers on one trace simultaneously
- 🎨 White-label theming — swap primary/accent colors and logo per organization/partner
- 🔌 REST API first, so the same engine can back a web UI, a mobile app, or a device integration

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Tech Stack

| Layer                     | Choice                                                        | Why                                                                                                                                                                                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**               | **NestJS** (Node.js, TypeScript)                              | Opinionated modular structure maps cleanly onto "one module per guideline strategy," built-in DI makes swapping/extending classifiers trivial, first-class OpenAPI/Swagger support for a public API partners will integrate against. Express is a fine minimal alternative if you want a lighter footprint. |
| **Classification engine** | Plain TypeScript, framework-agnostic `core` package           | Keeps the clinical rule logic portable/testable independent of the web framework — can be reused in a CLI, a batch job, or embedded elsewhere.                                                                                                                                                              |
| **Frontend**              | HTML + **Tailwind CSS** (+ Alpine.js for light interactivity) | Simple, dependency-light UI; Tailwind's config-driven theming (`tailwind.config.js`) is the natural place to inject per-partner brand tokens.                                                                                                                                                               |
| **Charting**              | Chart.js                                                      | Renders the FHR/contraction trace and highlights decel/accel windows.                                                                                                                                                                                                                                       |
| **Database**              | PostgreSQL (via Prisma)                                       | Structured feature data, audit trail of classifications, org/branding config. MongoDB is a reasonable swap if you prefer schema-less trace payloads.                                                                                                                                                        |
| **Auth**                  | JWT + refresh tokens (or OIDC/SSO for hospital IT)            | Multi-tenant org isolation.                                                                                                                                                                                                                                                                                 |
| **Object storage**        | S3-compatible (MinIO for local dev)                           | Partner logo assets, exported PDF reports.                                                                                                                                                                                                                                                                  |
| **Containerization**      | Docker + docker-compose                                       | One-command local spin-up; matches typical hospital IT deployment constraints (on-prem friendly).                                                                                                                                                                                                           |

> **Why NestJS over plain Express:** three (soon possibly more) independent classification strategies, a multi-tenant branding layer, and a public-facing API partners will build against — Nest's modules/providers/guards give you that structure for free. If the team is small and wants minimal ceremony, Express + a manual `strategies/` folder is a completely valid fallback; the architecture works with either.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Brand System (default theme)

The UI ships with a default brand theme, fully overridable per tenant/partner via the branding config (see `ARCHITECTURE.md § Multi-tenant branding`).

| Token                  | Value     | Use                                                                                                    |
| ---------------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| Primary — Navy         | `#00296B` | Headers, primary buttons, nav bar, category badges                                                     |
| Accent — Signal Yellow | `#FFD500` | Highlights, active tab indicator, warning-adjacent accents (never body text on white — fails contrast) |
| Background             | `#FFFFFF` | Page background                                                                                        |
| Surface                | `#F5F7FA` | Cards, table stripes                                                                                   |
| Text                   | `#1A1A1A` | Body copy                                                                                              |

```js
// tailwind.config.js (excerpt)
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary, #00296B)",
          accent: "var(--brand-accent, #FFD500)",
        },
      },
    },
  },
};
```

Per-tenant overrides are injected as CSS custom properties (`--brand-primary`, `--brand-accent`) at render time from each organization's stored branding config — so the same compiled CSS serves every partner without a rebuild.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Project Structure

> This is the current scaffold. `docker-compose.yml`, Prisma/Postgres, and auth are the next layer to add — right now `apps/api`'s traces/branding stores are deliberately in-memory reference implementations (clearly marked in the source) so the classification engine, Swagger contract, and UI wiring can be reviewed and extended independently of a persistence choice.

```
Ctg-Early-Warning-System/
├── ARCHITECTURE.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── DISCLAIMER.md
├── LICENSE.md
├── MAINTAINERS.md
├── OPEN_SOURCE_CHECKLIST.md
├── PROJECT_CHARTER.md
├── README.md
├── apps/
│   ├── api/                          # NestJS backend
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts                       # Swagger setup, validation, CORS
│   │   │   └── modules/
│   │   │       ├── branding/                 # in-memory tenant theme store (swap for Postgres)
│   │   │       │   ├── branding.controller.ts
│   │   │       │   ├── branding.module.ts
│   │   │       │   ├── branding.service.ts
│   │   │       │   └── dto/
│   │   │       │       └── branding-config.dto.ts
│   │   │       ├── classification/
│   │   │       │   ├── classification.controller.ts
│   │   │       │   ├── classification.module.ts
│   │   │       │   ├── classification.service.ts
│   │   │       │   └── dto/
│   │   │       │       ├── classification-result.dto.ts
│   │   │       │       └── ctg-features.dto.ts
│   │   │       ├── health/
│   │   │       │   └── health.controller.ts
│   │   │       └── traces/                   # in-memory audit trail (swap for Prisma/Postgres)
│   │   │           ├── dto/
│   │   │           │   └── create-trace.dto.ts
│   │   │           ├── entities/
│   │   │           │   └── trace-record.entity.ts
│   │   │           ├── traces.controller.ts
│   │   │           ├── traces.module.ts
│   │   │           └── traces.service.ts
│   │   ├── test/
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── tsconfig.build.json
│   │   └── tsconfig.json
│   └── web/                          # HTML + Tailwind v4 UI
│       ├── Dockerfile
│       ├── docker-entrypoint.sh
│       ├── nginx.conf
│       ├── package.json
│       ├── public/
│       │   ├── config.js
│       │   ├── favicon.ico
│       │   ├── index.html
│       │   ├── main.js
│       │   └── output.css            # compiled by `npm run build:css`
│       ├── server.js                 # zero-dep static server for local dev
│       └── src/
│           └── input.css             # @theme brand tokens (Tailwind v4 CSS-first config)
├── assets/
│   └── logo-wordmark.svg
├── docker-compose.yml
├── docs/                             # GitHub Pages developer docs site
│   ├── _config.yml
│   ├── api-reference.md
│   ├── architecture.md
│   ├── getting-started.md
│   └── index.md
├── package.json
└── packages/
    └── core/                         # framework-agnostic classification engine
        ├── package.json
        ├── src/
        │   ├── guideline-strategy.interface.ts
        │   ├── index.ts
        │   ├── strategies/
        │   │   ├── acog.strategy.ts
        │   │   ├── figo.strategy.ts
        │   │   ├── nice.strategy.ts
        │   │   └── strategies.spec.ts
        │   └── types/
        │       └── ctg-features.ts
        └── tsconfig.json
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Getting Started

This repo is an npm workspaces monorepo: `packages/core` (classification engine) is a workspace dependency of `apps/api`.

### Prerequisites

- Node.js ≥ 20
- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/DOTO-Health/ctg-early-warning-system.git
   cd ctg-early-warning-system
   ```
2. Install and link all workspaces
   ```sh
   npm install
   ```
3. Build the classification engine once (`apps/api` depends on its `dist/` output)
   ```sh
   npm run build --workspace=packages/core
   ```
4. Start the API (NestJS 11, Swagger at `/api/docs`) — **Terminal 1**
   ```sh
   cd apps/api
   npm run start:dev
   # -> http://localhost:3000/api
   # -> http://localhost:3000/api/docs   (interactive Swagger UI)
   ```
5. Start the Web UI (HTML + Tailwind v4) — **Terminal 2**
   ```sh
   cd apps/web
   npm run dev
   # -> http://localhost:5173
   ```
6. Open `http://localhost:5173?org=default` — the UI fetches its theme from `GET /api/branding/default` (Navy `#00296B` / Signal Yellow `#FFD500`) and applies it as CSS custom properties, so a different partner's theme is just a different `?org=` slug (see `PUT /api/branding/:orgSlug`) with no rebuild.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Running Tests

```sh
# classification engine unit tests
cd packages/core && npm run build && node --test dist/strategies/strategies.spec.js

# API e2e tests (health, guidelines, classify-all, validation, branding)
cd apps/api && npm run test:e2e
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## API Usage Example

```http
POST /api/classification/all
Content-Type: application/json

{
  "baseline": 145,
  "variability": 8,
  "accelerationCount": 2,
  "lateDecelCount": 0,
  "earlyDecelCount": 1,
  "variableDecelCount": 0,
  "prolongedDecelCount": 0,
  "repetitiveVariable": false,
  "contractionsPer10Min": 3,
  "totalDecelCount": 1
}
```

```json
{
  "FIGO": "Normal",
  "NICE": "Atypical",
  "ACOG": "Category II"
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Roadmap

- [x] Classification engine: FIGO / NICE / ACOG strategies
- [x] "Compare all guidelines" endpoint
- [x] Multi-tenant branding (CSS custom properties, per-`org` slug)
- [x] Swagger/OpenAPI docs
- [ ] Docker + docker-compose one-command local stack
- [ ] Prisma/PostgreSQL persistence (replace in-memory traces/branding stores)
- [ ] JWT / OIDC auth and org isolation
- [ ] PDF report export
- [ ] Additional guideline strategies (pluggable)

See the [open issues](https://github.com/DOTO-Health/ctg-early-warning-system/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full dev workflow, branch/PR conventions, and how to add a new guideline strategy. Every PR runs through [CI](./.github/workflows/ci.yml) — split into `core`, `api`, and `web` jobs so you can see exactly which part broke. See [OPEN_SOURCE_CHECKLIST.md](./OPEN_SOURCE_CHECKLIST.md) for everything the maintainers still need to lock down before/while going public.

Fuller developer documentation (architecture, API reference, getting started) lives at **[DOTO-Health.github.io/ctg-early-warning-system](https://DOTO-Health.github.io/ctg-early-warning-system/)**.

All contributors are expected to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## License

Licensed under [Apache License 2.0](./LICENSE.md)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Contact

DOTO Software - software@dotohealth.com

Project Link: [https://github.com/DOTO-Health/ctg-early-warning-system](https://github.com/DOTO-Health/ctg-early-warning-system)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Acknowledgments

- [FIGO Intrapartum Fetal Monitoring Guidelines](https://www.figo.org/)
- [NICE Intrapartum Care Guidelines](https://www.nice.org.uk/)
- [ACOG Practice Bulletins](https://www.acog.org/)
- [Choose an Open Source License](https://choosealicense.com)
- [Img Shields](https://shields.io)
- [Chart.js](https://www.chartjs.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
