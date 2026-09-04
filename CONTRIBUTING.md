# Contributing to CTG - Early Warning System

Thanks for considering contributing. This doc covers how to get set up, how testing/CI work, and what happens when you open a PR.

## Getting set up

```bash
git clone https://github.com/DOTO-Health/ctg-early-warning-system.git
cd ctg-early-warning-system
npm install
npm run build --workspace=packages/core   # apps/api depends on this being built
```

Then, in separate terminals:
```bash
cd apps/api && npm run start:dev   # http://localhost:3000/api/docs
cd apps/web && npm run dev         # http://localhost:5173
```

## Before opening a PR

Run the same checks CI will run:

```bash
npm run build --workspace=packages/core
node --test packages/core/dist/strategies/*.spec.js

npm run lint --workspace=apps/api
npm run build --workspace=apps/api
npm run test:e2e --workspace=apps/api

npm run build:css --workspace=apps/web
```

All of this runs automatically on every PR via `.github/workflows/ci.yml`, split into three jobs (`core`, `api`, `web`) so you can see exactly which part broke instead of one opaque "build failed."

## Changing the classification engine

`packages/core` (the FIGO/NICE/ACOG logic) is treated differently from the rest of the codebase, for the same reason a payments engine or a auth library would be: incorrect behavior here isn't a UI bug, it's a wrong clinical category. Concretely:

- **Any change to classification *behavior*** (not just a refactor) needs the PR template's "Clinical logic review flag" section filled in — what changes, before vs. after, and why.
- **Rule-set changes bump the strategy's `version` field.** This isn't optional — it's what keeps historical classifications reproducible after the rule changes (see `ARCHITECTURE.md § Versioning of rules`).
- **New guidelines need a cited source before implementation starts.** Open an issue using the "New guideline strategy proposal" template first — this project doesn't implement classification rules without a linked, official source document. This mirrors the provenance requirement in `PROJECT_CHARTER.md`.
- At least one maintainer with clinical domain familiarity should review changes here, not just engineering review — see `PROJECT_CHARTER.md § Community` for how that's organized as the maintainer group grows.

## Discuss before building anything large

For a new guideline strategy, a new module, or any change to the branding/multi-tenant architecture — open a GitHub Discussion or issue *before* writing the code. This isn't bureaucracy for its own sake: it's cheaper to align on the approach in a comment thread than after a few hundred lines are already written. Small fixes, docs, and clear bugs don't need this — just open a PR.

As the project grows, final say on direction rests with the maintainers listed in `MAINTAINERS.md` — this keeps decision-making fast rather than requiring consensus on every change, the same tradeoff Somleng makes.

## Commit / branch conventions

- Branch names: `fix/short-description`, `feat/short-description`, `docs/short-description`
- Commits: plain, descriptive messages — no enforced format yet. This is a good candidate for tightening up (e.g. Conventional Commits) once the contributor base grows past a handful of people; not worth the overhead before then.

## Code of Conduct

Participation is governed by `CODE_OF_CONDUCT.md`. Report concerns per the contact path there.