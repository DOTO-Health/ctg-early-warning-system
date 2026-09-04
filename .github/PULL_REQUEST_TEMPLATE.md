<!--
Thanks for the PR! Fill in what applies — delete sections that don't apply (e.g. skip the
clinical logic section entirely for a docs-only or tooling change).
-->

## Description

<!-- What does this PR change, and why? -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Tooling / CI
- [ ] Classification engine change (guideline rules, thresholds, categories)

## Related issue

<!-- Closes #___, or link the relevant discussion/RFC -->

## Testing done

<!-- Commands you ran, e.g.:
npm run build --workspace=packages/core
node --test packages/core/dist/strategies/*.spec.js
npm run lint --workspace=apps/api && npm run build --workspace=apps/api && npm run test:e2e --workspace=apps/api
npm run build:css --workspace=apps/web
-->

---

## Clinical logic review flag

**Required if this PR changes `packages/core` classification _behavior_** (not needed for a pure
refactor, tests, or non-behavioral change). See
[PROJECT_CHARTER.md § How decisions get made](../PROJECT_CHARTER.md#how-decisions-get-made) and
[CONTRIBUTING.md § Changing the classification engine](../CONTRIBUTING.md#changing-the-classification-engine).

- **Does this PR change classification behavior?** Yes / No
- **Cited guideline source** (document + version/date being encoded):
- **What changes, before vs. after:**
- **Why:**
- **Strategy `version` field bumped?** Yes / No / N/A
- **Clinical/guideline reviewer:** @

## Checklist

- [ ] CI passes (core / api / web)
- [ ] Relevant docs updated (`README.md`, `docs/`, `ARCHITECTURE.md`) if behavior or setup changed
- [ ] I've read and followed the [Code of Conduct](../CODE_OF_CONDUCT.md)
