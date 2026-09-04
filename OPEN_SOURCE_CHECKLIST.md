# Open Source Readiness Checklist

Items below are marked by status, not treated as pass/fail gates. This
file should be updated as each item lands or changes.

**Legend:** ✅ Done · 🟡 In progress / draft · ⬜ Not started

| #   | Item                                       | Status | Evidence                                                                                                                                                                                                                                                                                                                                               |
| --- | ------------------------------------------ | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | LICENSE                                    |   ✅   | [`LICENSE.md`](./LICENSE.md) — Apache License 2.0                                                                                                                                                                                                                                                                                                      |
| 2   | README with project status                 |   ✅   | [`README.md § Project Status`](./README.md#project-status) — explicit pre-release status, implemented/in-progress/not-started breakdown, linked near the top of the README                                                                                                                                                                             |
| 3   | PROJECT_CHARTER.md                         |   ✅   | [`PROJECT_CHARTER.md`](./PROJECT_CHARTER.md) — mission, principles, guideline-provenance requirement, governance; linked from [README § Contributing](./README.md#contributing)                                                                                                                                                                        |
| 4   | CODE_OF_CONDUCT.md                         |   ✅   | [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) — Contributor Covenant v2.1, linked from [README § Contributing](./README.md#contributing)                                                                                                                                                                                                                |
| 5   | Contributing guide                         |   ✅   | [`CONTRIBUTING.md`](./CONTRIBUTING.md) — dev setup, pre-PR checklist, classification-engine review process, branch/commit conventions                                                                                                                                                                                                                  |
| 6   | QA and PR approach doc                     |   ✅   | [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) (required checks: `core`, `api`, `web` jobs) + [`CONTRIBUTING.md § Before opening a PR`](./CONTRIBUTING.md#before-opening-a-pr) and [`§ Changing the classification engine`](./CONTRIBUTING.md#changing-the-classification-engine) (extra clinical-logic review flag, versioned rule changes) |
| 7   | Minimal developer docs site (GitHub Pages) |   ✅   | [`docs/`](./docs/) — published at `https://DOTO-Health.github.io/ctg-early-warning-system/`; pages: [Home](./docs/index.md), [Getting Started](./docs/getting-started.md), [Architecture](./docs/architecture.md), [API Reference](./docs/api-reference.md). (source: `main` / `docs`)                                                                 |

## Notes

- This checklist intentionally does not block merges — it's a status tracker for open-source
  readiness, not a CI gate. Update the table and open items as each piece lands.
- If an evidence link 404s or the linked file moves, fix the link here rather than deleting the
  row — the row itself documents what's expected to exist.
