---
title: Home
---

# Ctg-Early-Warning-System — Developer Docs

Developer-facing documentation for the multi-guideline CTG (Cardiotocography) interpretation
platform. This site is a hub — most of the source-of-truth content lives in the repo itself and
is linked from here rather than duplicated.

> ⚠️ **Clinical disclaimer:** this project is a decision-support and educational tool. It does not
> replace clinical judgement and is not a certified medical device unless independently validated
> and cleared for your jurisdiction. See [DISCLAIMER.md]({{ site.repo_url }}/blob/main/DISCLAIMER.md).

## Start here

- **[Getting Started](./getting-started.html)** — clone, install, run the API and web UI locally.
- **[Architecture](./architecture.html)** — how `packages/core`, `apps/api`, and `apps/web` fit
  together, and the multi-tenant branding model.
- **[API Reference](./api-reference.html)** — REST endpoints; full interactive docs are served by
  the API itself via Swagger.

## Contributing

- **[Contributing Guide]({{ site.repo_url }}/blob/main/CONTRIBUTING.md)** — dev setup, PR checklist,
  and the extra review process for changes to the classification engine.
- **[CI Workflow]({{ site.repo_url }}/blob/main/.github/workflows/ci.yml)** — what runs on every
  PR (`core`, `api`, `web` jobs) and what has to pass before merge.
- **[Code of Conduct]({{ site.repo_url }}/blob/main/CODE_OF_CONDUCT.md)**

## Project reference

- [README]({{ site.repo_url }}/blob/main/README.md)
- [ARCHITECTURE.md]({{ site.repo_url }}/blob/main/ARCHITECTURE.md)
- [OPEN_SOURCE_CHECKLIST.md]({{ site.repo_url }}/blob/main/OPEN_SOURCE_CHECKLIST.md)
- [LICENSE.md]({{ site.repo_url }}/blob/main/LICENSE.md)

---

<p align="center">
  <img src="{{ site.baseurl }}/assets/doto-trademark.jpeg" alt="DOTO Health" width="140">
</p>

<p align="center">
  <sub>DOTO and the DOTO logo are trademarks of DOTO Health. Licensed under Apache 2.0 — trademark use is not covered by the code license. See <a href="{{ site.repo_url }}/blob/main/LICENSE.md">LICENSE.md</a>.</sub>
</p>
