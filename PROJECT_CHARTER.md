# Early Warning System (Rule-Based CTG/NST Classification Engine)

## What this project is

**Early Warning System** is an open-source, rule-based engine that classifies Cardiotocography
(CTG) traces against multiple international clinical guidelines — FIGO (2015), NICE NG229 (2022),
and ACOG (2025) — using deterministic logic.

**The problem it solves:** FIGO, NICE, ACOG, and WHO all evaluate the same underlying
physiological signals — baseline fetal heart rate, variability, accelerations, decelerations
(early, variable, late, prolonged), and uterine contractions — but differ in terminology, numeric
thresholds, and classification categories. In practice this means clinicians manually interpret
traces against whichever guideline their institution follows, and classification can vary between
reviewers. This project digitizes each guideline's published criteria into an explicit,
independently-applied rule set.

Given a set of extracted fetal parameters as input, the engine outputs a categorization per
guideline (e.g., Normal/Suspicious/Pathological under FIGO, Category I/II/III under ACOG, and
NICE's corresponding classification). It does not harmonize the guidelines into one answer, does
not interpret the classification, and does not recommend management — it categorizes only, per
published criteria, and leaves clinical judgment to the clinician. This mirrors the deterministic
rule-engine layer used for clinical alerting in our related AI Case Summarization project, but
here the entire engine is deterministic — there is no AI/LLM component in the classification path
itself.

## Why Apache License 2.0

1. **Adoption inside existing fetal-monitoring hardware and EHR systems.** CTG monitors, hospital
   EHRs, and telehealth/maternal-monitoring platforms are frequently commercial, closed-source
   products. Apache 2.0 allows this classification logic to be embedded directly into those
   systems — including proprietary ones — without forcing vendors to open-source their own stack.
   A copyleft license would likely block exactly the integrations that make this engine
   clinically useful.
2. **Patent grant, which matters for guideline-derived logic.** Apache 2.0 includes an express
   patent license from contributors to users, plus defensive patent termination. Since this
   engine encodes thresholds and classification rules published by professional bodies (FIGO,
   NICE, ACOG), the explicit patent grant reduces legal ambiguity for anyone building on top of
   it.
3. **Traceable modification history.** Guideline criteria change over time (NICE NG229 was last
   reviewed in 2025; ACOG's current version dates to late 2025). Apache 2.0 requires derivative
   works to note what was changed, helping downstream users know which guideline-version and
   rule-set they're actually running — important when a classification engine's correctness is
   tied to keeping pace with revised clinical guidance.

We avoided copyleft licensing for the same reason as our sister project: this tool is only
valuable if it gets embedded into the monitoring devices and hospital systems clinicians already
use, and permissive licensing removes the main barrier to that.

## How decisions get made

- **Non-clinical changes** (performance, signal-processing infrastructure, tooling, tests):
  normal pull-request review, merged with at least one maintainer approval.
- **Changes to guideline rules or thresholds:** require a cited reference to the specific
  guideline document/version being encoded, plus explicit approval from a clinical/guideline
  reviewer, before merge — this is the project's core safety gate, since an incorrect threshold
  directly changes a patient's classification.
- **Adding support for a new guideline** (e.g., a future WHO-specific ruleset) or major
  architectural changes: opened as a GitHub issue/RFC for discussion, decided by maintainer
  consensus after a comment period. Where consensus isn't reached, the lead maintainer(s) decide
  and record their reasoning publicly in the issue.
- **Guideline updates over time:** when FIGO, NICE, or ACOG publish revised criteria, updates are
  tracked as versioned rule-set changes (not silent edits) so downstream users can pin to a
  specific guideline version if needed.
- **Disputes:** resolved via open discussion in the relevant issue/PR; unresolved disagreements
  go to a maintainer vote, with the project lead breaking ties.

Because this engine's entire value proposition is transparency and reproducibility — the same
input always yields the same guideline-specific output — governance follows the same principle:
every rule change is traceable to a cited source and a named reviewer, not made silently or on a
maintainer's individual judgment alone.
