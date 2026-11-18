# Architecture Overview — CTG - Early Warning System

## 1. Goals driving the architecture

1. **Multi-guideline by design** — FIGO/NICE/ACOG (and future guidelines) must be independently addable/removable without touching unrelated code.
2. **White-label / multi-tenant** — one deployment can serve several hospitals or device-vendor partners, each with their own logo + colors, without forking the codebase.
3. **API-first** — the web UI is one consumer of the classification API; a partner's own device software or mobile app should be able to call the same endpoint.
4. **Portable clinical logic** — the actual rule engine must be usable outside the web framework (tests, CLI batch scoring, future mobile/embedded reuse).

## 2. High-level system diagram

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        WEB["Web UI (HTML + Tailwind CSS)"]
        PARTNER["Partner Integration (REST/API)"]
    end

    subgraph Gateway["API Gateway (NestJS)"]
        AUTH["Auth Guard / JWT / Org Context"]
        CTRL["Classification Controller"]
        TRACECTRL["Traces Controller"]
        BRANDCTRL["Branding Controller"]
    end

    subgraph Core["Classification Engine (framework-agnostic)"]
        FIGO["FIGO Strategy"]
        NICE["NICE Strategy"]
        ACOG["ACOG Strategy"]
        ENGINE["Classification Service\n(runs 1..N strategies)"]
    end

    subgraph Data["Persistence"]
        PG[("PostgreSQL\ntraces, orgs, users, audit log")]
        S3[("S3 / MinIO\nlogos, exported reports")]
    end

    WEB --> AUTH
    PARTNER --> AUTH
    AUTH --> CTRL
    AUTH --> TRACECTRL
    AUTH --> BRANDCTRL
    CTRL --> ENGINE
    ENGINE --> FIGO
    ENGINE --> NICE
    ENGINE --> ACOG
    TRACECTRL --> PG
    BRANDCTRL --> PG
    BRANDCTRL --> S3
    ENGINE --> PG
```

## 3. Request flow — "classify against all guidelines"

```mermaid
sequenceDiagram
    participant U as Clinician (Web UI)
    participant API as NestJS Controller
    participant SVC as Classification Service
    participant S1 as FIGO Strategy
    participant S2 as NICE Strategy
    participant S3 as ACOG Strategy
    participant DB as PostgreSQL

    U->>API: POST /classification/all { CTGFeatures }
    API->>SVC: classifyAll(features)
    par run strategies concurrently
        SVC->>S1: classify(features)
        SVC->>S2: classify(features)
        SVC->>S3: classify(features)
    end
    S1-->>SVC: "Normal"
    S2-->>SVC: "Atypical"
    S3-->>SVC: "Category II"
    SVC->>DB: persist trace + results (audit trail)
    SVC-->>API: { FIGO, NICE, ACOG }
    API-->>U: 200 OK JSON
```

## 4. Classification engine — strategy pattern

The web platform this becomes an explicit **strategy pattern**, so each guideline is independently testable, versionable, and hot-swappable:

```typescript
// packages/core/src/types/CTGFeatures.ts
export interface CTGFeatures {
  baseline: number;
  variability: number;
  accelerationCount: number;
  lateDecelCount: number;
  earlyDecelCount: number;
  variableDecelCount: number;
  prolongedDecelCount: number;
  totalDecelCount: number;
  repetitiveVariable: boolean;
  contractionsPer10Min: number;
}

// packages/core/src/guideline-strategy.interface.ts
export interface GuidelineStrategy {
  readonly id: "FIGO" | "NICE" | "ACOG";
  classify(features: CTGFeatures): string;
}
```

```typescript
// packages/core/src/figo.ts
import {CTGFeatures} from "./types/CTGFeatures";
import {GuidelineStrategy} from "./guideline-strategy.interface";

export const FigoStrategy: GuidelineStrategy = {
  id: "FIGO",
  classify(f: CTGFeatures): string {
    const abnormalBaseline = f.baseline < 100 || f.baseline > 180;
    const abnormalVariability = f.variability < 5 || f.variability > 25;
    const hasSevereDecels = f.lateDecelCount > 0 || f.prolongedDecelCount > 0;

    if (
      abnormalBaseline &&
      abnormalVariability &&
      hasSevereDecels &&
      f.accelerationCount === 0 &&
      hasSevereDecels &&
      (f.lateDecelCount >= 3 ||
        f.prolongedDecelCount >= 3 ||
        f.repetitiveVariable)
    )
      return "Pathological";

    const borderlineBaseline =
      (f.baseline >= 100 && f.baseline <= 109) ||
      (f.baseline > 160 && f.baseline <= 180);

    if (
      borderlineBaseline &&
      abnormalVariability &&
      f.accelerationCount <= 1 &&
      ((f.lateDecelCount >= 1 && f.lateDecelCount <= 2) ||
        (f.prolongedDecelCount >= 1 && f.prolongedDecelCount <= 2))
    )
      return "Suspicious";

    return "Normal";
  },
};
```

The service layer simply iterates over a registered list of strategies:

```typescript
// apps/api/src/modules/classification/classification.service.ts
@Injectable()
export class ClassificationService {
  private readonly strategies: GuidelineStrategy[] = [
    FigoStrategy,
    NiceStrategy,
    AcogStrategy,
  ];

  classifyAll(features: CTGFeatures): Record<string, string> {
    return Object.fromEntries(
      this.strategies.map((s) => [s.id, s.classify(features)]),
    );
  }

  classifyOne(id: string, features: CTGFeatures): string {
    const strategy = this.strategies.find((s) => s.id === id);
    if (!strategy) throw new NotFoundException(`Unknown guideline: ${id}`);
    return strategy.classify(features);
  }
}
```

**Adding a new guideline** (e.g. a national variant) is then: implement `GuidelineStrategy`, register it in the array (or auto-discover via Nest's DI token multi-provider pattern), add UI copy — no changes anywhere else.

> **Note on the source logic:** the original Java conditions for FIGO/NICE/ACOG had a few internal inconsistencies worth resolving during the port — e.g. in `classifyNICE`, `f.baseline < 100 || f.baseline > 180` binds looser than intended due to Java operator precedence (`&&` binds tighter than `||`), so it evaluates as `f.baseline < 100 || (f.baseline > 180 && ...)` rather than the probably-intended `(f.baseline < 100 || f.baseline > 180) && ...`. Flag this to your clinical reviewer before porting the rules verbatim — the TypeScript port should use explicit parentheses either way to avoid the ambiguity.

## 5. Multi-tenant branding

```mermaid
flowchart LR
    ORG[("Organization record\n(id, name, slug)")] --> BRAND[("BrandingConfig\nprimaryColor, accentColor, logoUrl")]
    BRAND --> CSS["CSS custom properties\ninjected at page render"]
    CSS --> TAILWIND["Tailwind brand.* classes\nresolve via var(--brand-*)"]
```

- Each `Organization` (hospital, clinic, or device-vendor partner) owns one `BrandingConfig` row: primary color, accent color, logo asset URL, optional custom domain.
- On page load, the web app fetches the org's branding config and sets CSS custom properties (`--brand-primary`, `--brand-accent`) on `:root`; Tailwind's `brand.primary` / `brand.accent` utility classes reference those variables, so **no rebuild is needed per tenant** — one compiled CSS bundle serves everyone.
- Logo assets are stored in S3/MinIO under `orgs/{orgId}/logo.png` and served via signed/public URL depending on deployment.
- Default fallback theme = Navy `#00296B` / Signal Yellow `#FFD500` (see README brand table).

## 6. Deployment view

```mermaid
flowchart TB
    subgraph "Docker Compose / K8s"
        WEBC["web container\n(static Tailwind build, nginx)"]
        APIC["api container\n(NestJS)"]
        PGC[("postgres container")]
        MINIOC[("minio container")]
    end
    LB["Load Balancer / Reverse Proxy"] --> WEBC
    LB --> APIC
    APIC --> PGC
    APIC --> MINIOC
```

For hospital on-prem deployments, the same `docker-compose.yml` runs air-gapped; for SaaS/multi-tenant hosting, swap Postgres/MinIO for managed equivalents (RDS, S3) and put both containers behind the same load balancer/ingress.

## 7. Cross-cutting concerns

| Concern                 | Approach                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Audit trail**         | Every classification call is persisted with input features, per-guideline result, timestamp, and requesting user/org — required for clinical traceability and later validation studies. |
| **Versioning of rules** | Each strategy exposes a `version` field; stored alongside results so historical classifications remain reproducible even after a rule update.                                           |
| **Validation**          | Input DTOs validated with `class-validator` (Nest) before reaching the engine — reject out-of-range physiological values early.                                                         |
| **Observability**       | Structured logging (pino), request tracing, and a `/health` endpoint for orchestration probes.                                                                                          |
| **Extensibility**       | New guideline = new strategy file + registration; new partner = new org + branding config row — no code fork required.                                                                  |

## 8. Digital Public Good alignment

Mapped to the nine indicators of the [DPG Standard](https://digitalpublicgoods.net/standard/).
"Status" is an honest self-assessment; confirm the details against the current DPG Standard guide
before submitting.

| #   | Indicator                     | How this project addresses it                                                                                                                                                                                                                         | Status                                                                                                                                       |
| --- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | SDG relevance                 | Maternal and newborn health: SDG 3 (target 3.1 maternal mortality, 3.2 newborn and stillbirth deaths) through consistent CTG risk classification; SDG 10 (reduced inequalities) through the charter's "last mile" vision for low-resource settings | Implied in PROJECT_CHARTER.md; add an explicit SDG statement to the README                                                                  |
| 2   | Open licensing                | Apache-2.0 for all code and docs ([LICENSE.md](./LICENSE.md)); rationale in [PROJECT_CHARTER.md](./PROJECT_CHARTER.md#why-apache-license-20)                                                                                                         | In place; fix the README licence badge link (`./LICENSE` → `./LICENSE.md`)                                                                   |
| 3   | Clear ownership               | Copyright DOTO Health Pvt Ltd; DOTO trademark stated as outside the code licence; maintainer listed in [MAINTAINERS.md](./MAINTAINERS.md)                                                                                                            | In place; decide on DCO or CLA so contributor copyright is clear                                                                             |
| 4   | Platform independence         | Open stack only (Node.js, NestJS, Tailwind, Docker); framework-agnostic `packages/core`; REST/OpenAPI so any client can integrate; runs air-gapped on-prem. Only external request is Google Fonts                                                   | Mostly met; self-host the fonts so the web UI works fully offline                                                                            |
| 5   | Documentation                 | README, this file, [CONTRIBUTING.md](./CONTRIBUTING.md), Swagger at `/api/docs`, GitHub Pages developer docs, [DISCLAIMER.md](./DISCLAIMER.md), [OPEN_SOURCE_CHECKLIST.md](./OPEN_SOURCE_CHECKLIST.md)                                           | Largely met; add a production deployment guide and a guideline-provenance record (source document and version per strategy)                 |
| 6   | Mechanism for extracting data | Inputs and results are plain JSON; `GET /api/traces` returns the full trace history (features, per-guideline results, rule version, timestamp) in a documented OpenAPI schema                                                                       | Partly met; add bulk export (CSV/JSON download) once persistence lands                                                                       |
| 7   | Privacy and applicable laws   | Open-source core collects no patient identifiers (only CTG features and an optional free-text label); stores are in-memory; no auth or persistence in core. Deployers own HIPAA/GDPR/DPDP Act 2023 compliance (see DISCLAIMER.md)                  | Open: privacy notice, warning against PII in the free-text `label`, and data-retention guidance for deployers                                |
| 8   | Standards and best practices  | REST + OpenAPI 3, input validation with `class-validator`, versioned rule sets, CI on every PR; FIGO 2015, NICE NG229 and ACOG as the clinical content standards                                                                                    | Open: accessibility (WCAG 2.1 AA) audit of the web UI; HL7 FHIR mapping (e.g. `Observation`) for EMR/device integration                     |
| 9   | Do no harm by design          | Deterministic rules, no AI/LLM; categorises only, no diagnosis or management advice; clinical disclaimer; rule changes need a cited guideline and clinical reviewer; rule version stored with every result; no patient data in core                | Gate defined in PROJECT_CHARTER.md; no named clinical reviewer yet in MAINTAINERS.md; known NICE operator-precedence issue (§4) to resolve |
